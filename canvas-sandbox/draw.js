// Our simpler drawing API
// based on Dynamicland illumination API

const DEFAULTS = {
  text: '',
  x: 0,
  y: 0,
  fontSize: 24,
  fontFace: 'serif',
  color: 'black',
  stroke: '',
  textAlign: 'center',
  textBaseline: 'top',
};

const ATTRIBUTES = ['font', 'fillStyle', 'strokeStyle', 'currentTransform','direction','filter','globalAlpha','globalCompositeOperation','imageSmoothingEnabled','imageSmoothingQuality','lineCap','lineDashOffset','lineJoin','miterLimit','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY','textAlign','textBaseline'];

const TRANSFORMS = {
  font: ({fontSize, fontFace}) => {
    return `${fontSize}px ${fontFace}`;
  },
  fillStyle: ({color}) => {
    return color;
  },
  strokeStyle: ({stroke}) => {
    return stroke;
  },
  lineWidth: ({strokeWidth}) => {
    return strokeWidth;
  },
};

const STATES = Object.keys(DEFAULTS)
                      .concat(ATTRIBUTES)
                      .concat(['width', 'height', 'radius'])

const identity = (value) => (value)
const property = (property, object) => (object[property])

const transformOrProperty = (allKeys, transforms, options) => {
  return allKeys
          .reduce((result, ctxAttr) => {
            const transform = transforms[ctxAttr] ||
                              property.bind(null, ctxAttr);

            const newAttr = {
              [ctxAttr]: transform(options),
            };

            if (newAttr[ctxAttr] === undefined) {
              return result;
            }

            return Object.assign(result, newAttr);
          }, {});
}

const setCtxAttributes = (ctx, options) => {
  const newAttributes = transformOrProperty(ATTRIBUTES, TRANSFORMS, options);
  Object.assign(ctx, newAttributes);
};

// Draw
const text = (ctx, options) => {
  const { text, x, y, color, stroke } = options;

  setCtxAttributes(ctx, options);

  if (color) {
    ctx.fillText(text, x, y);
  }

  if (stroke) {
    ctx.strokeText(text, x, y);
  }
};

const label = (ctx, text) => {};

const rectangle = (ctx, options) => {
  const { x, y, width, height, stroke, color } = options;

  setCtxAttributes(ctx, options);

  if (color) {
    ctx.fillRect(x, y, width, height);
  }

  if (stroke) {
    ctx.strokeRect(x, y, width, height);
  }
};

const circle = (ctx, options) => {
  const { x, y, radius, stroke, color } = options;

  setCtxAttributes(ctx, options);

  ctx.beginPath();

  ctx.arc(x, y, radius, 0, 2 * Math.PI);

  if (color) {
    ctx.fill();
  }

  if (stroke) {
    ctx.stroke();
  }

  ctx.closePath();
};


const line = (ctx, { from, to, radius, stroke, strokeWidth }) => {};

// Animate
const loop = (ctx, draw) => {
  // pass time "t" to draw
};


class Stretcher {
  constructor (ctx, defaults = DEFAULTS) {
    this.ctx = ctx;
    this.defaults = transformOrProperty(Object.keys(DEFAULTS), {
      x: this.defaultX.bind(this),
      y: this.defaultY.bind(this),
    }, defaults);

    this.actions = {
      write: text,
      rectangle,
      circle,
      line,
    };

    this.steps = [];

    Object.entries(this.actions)
      .forEach(this.wrapAction.bind(this));

    STATES.forEach(this.wrapChainableState.bind(this));

    this.resetState();

    return this;
  }

  defaultX() {
    return this.ctx.canvas.width / 2;
  }

  defaultY() {
    return this.ctx.canvas.height / 2;
  }

  extendDefaults (...options) {
    return Object.assign({}, this.defaults, this.state, ...options);
  }

  wrapAction ([actionName, action]) {
    this[actionName] = (...options) => {
      let actionOptions = this.extendDefaults(...options);
      this.log(`${actionName} with options `, actionOptions);

      action(this.ctx, actionOptions);

      this.resetCanvas();
      return this;
    }
  }

  wrapChainableState (stateName) {
    this[stateName] = (value) => {
      this.state[stateName] = identity(value)
      return this;
    }
  }

  resetState () {
    this.state = {};
    return this;
  }

  resetCanvas () {
    this.resetState();
    setCtxAttributes(this.ctx, this.defaults);
    return this;
  }

  step (draw) {
    this.steps.push(draw);
    return this;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    return this;
  }

  loop () {

    let frame = 0;
    let start = null;

    let step = (timestamp) => {
      if (!start) start = timestamp;

      let hasNext = this.steps.reduce((result, draw) => {
        return draw.call(this, timestamp - start, frame) || result;
      }, false);

      frame = frame + 1;

      if (hasNext) {
        this.request = requestAnimationFrame(step);
      }
    }

    this.request = requestAnimationFrame(step);

    return this;
  }

  unloop () {

    cancelAnimationFrame(this.request);
    this.steps = [];

    return this;
  }

  log () {
    // can use log levels to do different logging stuffs here.
    // can even use this to build an array of simple objects representing shapes
    console.warn(...arguments);
  }
}
