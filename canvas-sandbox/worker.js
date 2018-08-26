importScripts("draw.js"); // <-- our drawing helper

onmessage = function(evt) {
  const canvas = evt.data.canvas;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f00";
  ctx.fillRect(0, 0, 100, 100);

  // TODO: test our drawing helpers here
  
  const cool = new Stretcher(ctx);

  cool
    // The following chained rectangle drawing line could be
    // written in the object options syntax like so:
    // .rectangle({ x: 20, y: 30, width: 200, height: 100 })
    .x(20).y(30).width(200).height(100).color('blue').rectangle()
    .color('red').text('hello').write()
    .circle({ x: 200, y: 30, radius: 10, color: 'blue' })
    .step((timestamp, frame) => {
      if (timestamp < 60) {
        return true;
      }
      if (timestamp > 5000) {
        return false;
      }
      return cool
        .clear()
        .x(timestamp % cool.ctx.canvas.width).y(30).radius(10).color('blue').circle()
    })
    .step((timestamp, frame) => {
      if (timestamp <= 4000) {
        return true;
      }
      if (timestamp > 15000) {
        return false;
      }
      return cool
        .clear()
        .x(20).y(timestamp % cool.ctx.canvas.height).radius(10).color('blue').circle()
    })
    .loop()
};
