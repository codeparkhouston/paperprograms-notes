// Hiya
// (says "Hello World" and shoots pulsing balls at other papers)

importScripts("paper.js");
function randomColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

function direction(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = dist(a, b);
  return {
    x: dx / d,
    y: dy / d
  };
}
function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx ** 2 + dy ** 2);
}

(async () => {
  // Get a canvas object for this paper.
  const canvas = await paper.get("canvas");

  // Draw "Hello world" on the canvas.
  const ctx = canvas.getContext("2d");
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgb(255,0,0)";
  ctx.fillText("Hello", canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = "rgb(0,255,0)";
  ctx.fillText("world", canvas.width / 2, canvas.height / 2 + 20);
  ctx.commit();

  // Get a "supporter canvas", which is a canvas for the entire
  // projection surface.
  const supporterCanvas = await paper.get("supporterCanvas");
  const supporterCtx = supporterCanvas.getContext("2d");

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get("number");

  let t = 0;
  let dt = 12;

  // Repeat every 100 milliseconds.
  setInterval(async () => {
    t += dt;

    // Get a list of all the papers.
    const papers = await paper.get("papers");

    // Clear out the supporter canvas. We get our own canvas, so we won't
    // interfere with other programs by doing this.
    supporterCtx.clearRect(0, 0, supporterCanvas.width, supporterCanvas.height);

    // Draw a circle in the center of our paper.
    const myCenter = papers[myPaperNumber].points.center;
    supporterCtx.fillStyle = supporterCtx.strokeStyle = "rgb(0, 255, 255)";
    supporterCtx.beginPath();
    supporterCtx.arc(myCenter.x, myCenter.y, 10, 0, 2 * Math.PI);
    supporterCtx.fill();

    supporterCtx.fillText(JSON.stringify(myCenter), 0, 100);

    // Draw a line from our paper to each other paper.
    Object.keys(papers).forEach(otherPaperNumber => {
      if (otherPaperNumber !== myPaperNumber) {
        const otherCenter = papers[otherPaperNumber].points.center;

        supporterCtx.beginPath();
        supporterCtx.moveTo(myCenter.x, myCenter.y);
        supporterCtx.lineTo(otherCenter.x, otherCenter.y);
        supporterCtx.stroke();

        const otherDist = dist(myCenter, otherCenter);
        const otherDir = direction(myCenter, otherCenter);
        const d = (t / 2) % otherDist;
        const x = myCenter.x + d * otherDir.x;
        const y = myCenter.y + d * otherDir.y;
        supporterCtx.beginPath();
        supporterCtx.ellipse(x, y, 20, 20, 0, 0, 2 * Math.PI);
        supporterCtx.fillStyle = randomColor();
        supporterCtx.fill();
      }
    });

    const r = Math.abs(Math.sin(t * 50) * 20) + 100;

    supporterCtx.beginPath();
    supporterCtx.ellipse(myCenter.x, myCenter.y, r, r, 0, 0, 2 * Math.PI);
    supporterCtx.fillStyle = "rgba(255,255,255,0.5)";
    supporterCtx.fill();

    // Finally, commit to the canvas, which actually renders.
    supporterCtx.commit();
  }, dt);
})();
