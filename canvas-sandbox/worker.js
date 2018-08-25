importScripts("draw.js"); // <-- our drawing helper

onmessage = function(evt) {
  const canvas = evt.data.canvas;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f00";
  ctx.fillRect(0, 0, 100, 100);

  // TODO: test our drawing helpers here
};
