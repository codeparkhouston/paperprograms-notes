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
  logLevel: 3,
};

const ATTRIBUTES = ['font', 'fillStyle', 'strokeStyle', 'currentTransform','direction','filter','globalAlpha','globalCompositeOperation','imageSmoothingEnabled','imageSmoothingQuality','lineCap','lineDashOffset','lineJoin','lineWidth','miterLimit','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY','textAlign','textBaseline'];

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
};

const transformOrIdentity = (allKeys, transforms, options) => {
  return allKeys
          .reduce((result, ctxAttr) => {
            const transform = transforms[ctxAttr] ||
                              ((options) => (options[ctxAttr]));

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
  const newAttributes = transformOrIdentity(ATTRIBUTES, TRANSFORMS, options);
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
    this.defaults = transformOrIdentity(Object.keys(DEFAULTS), {
      x: this.defaultX.bind(this),
      y: this.defaultY.bind(this),
    }, DEFAULTS);

    this.chainedOptions = {};
    this.actions = {
      text,
      rectangle,
      circle,
      line,
    };

    Object.entries(this.actions)
      .forEach(this.wrapAction.bind(this));

    return this;
  }

  defaultX() {
    return this.ctx.canvas.width / 2;
  }

  defaultY() {
    return this.ctx.canvas.height / 2;
  }

  extendDefaults (...options) {
    return Object.assign({}, this.defaults, this.chainedOptions, ...options);
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

  resetCanvas () {
    setCtxAttributes(this.ctx, this.defaults);
    this.chainedOptions = {};
    return this;
  }

  log () {
    console.warn(...arguments);
  }
}
