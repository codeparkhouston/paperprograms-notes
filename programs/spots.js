// Hello world
// (draws red circles at random)

importScripts("paper.js");

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
  ctx.fillText("Amanda", canvas.width / 2, canvas.height / 2 + 20);
  //ctx.commit();

  // Get a "supporter canvas", which is a canvas for the entire
  // projection surface.
  const supporterCanvas = await paper.get("supporterCanvas");
  const supporterCtx = supporterCanvas.getContext("2d");

  // Get the paper number of this piece of paper (which should not change).
  const myPaperNumber = await paper.get("number");

  const makeRandomPaperPoint = () => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    return { x, y };
  };

  // Repeat every 100 milliseconds.
  setInterval(async () => {
    // Get a list of all the papers.
    const papers = await paper.get("papers");

    // Clear out the supporter canvas. We get our own canvas, so we won't
    // interfere with other programs by doing this.
    supporterCtx.clearRect(0, 0, supporterCanvas.width, supporterCanvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a circle in the center of our paper.
    // const myCenter = papers[myPaperNumber].points.topLeft;
    const myCenter = makeRandomPaperPoint(papers[myPaperNumber]);
    ctx.fillStyle = ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.beginPath();
    ctx.arc(myCenter.x, myCenter.y, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Draw a line from our paper to each other paper.
    Object.keys(papers).forEach(otherPaperNumber => {
      if (otherPaperNumber !== myPaperNumber) {
        const otherCenter = papers[otherPaperNumber].points.topLeft;

        supporterCtx.beginPath();
        supporterCtx.moveTo(myCenter.x, myCenter.y);
        supporterCtx.lineTo(otherCenter.x, otherCenter.y);
        supporterCtx.stroke();
      }
    });

    // Finally, commit to the canvas, which actually renders.
    supporterCtx.commit();
    ctx.commit();
  }, 24);
})();
