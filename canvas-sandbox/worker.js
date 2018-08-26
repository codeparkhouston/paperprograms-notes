importScripts("draw.js"); // <-- our drawing helper

onmessage = function(evt) {
  const canvas = evt.data.canvas;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f00";
  ctx.fillRect(0, 0, 100, 100);

  // TODO: test our drawing helpers here
  
  const cool = new Stretcher(ctx);

  cool.text({ text: 'hello' })
    // .rectangle({ x: 20, y: 30, width: 200, height: 100 })
    .circle({ x: 200, y: 30, radius: 10, color: 'blue' })
};
