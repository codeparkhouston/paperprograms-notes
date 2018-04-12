// Ball Escape

importScripts("paper.js");

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx ** 2 + dy ** 2);
}

const paddleDist = 400;
const ball = {
  x: 100,
  y: 100,
  speed: 700 / 1000, // 100 pixels per 1000 ms
  angle: Math.random() * Math.PI * 2,
  r: 40
};
ball.dx = Math.cos(ball.angle);
ball.dy = Math.sin(ball.angle);

function getPaddles(papers, corner) {
  const points = [];
  for (let id of Object.keys(papers)) {
    const other = papers[id];
    if (other.data.isPaddle) {
      points.push(other);
    }
  }
  const maxPaddles = Math.floor(points.length / 2);

  const lines = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i].points[corner];
      const b = points[j].points[corner];
      const dist = distance(a, b);
      if (dist < paddleDist) {
        lines.push({ i, j, dist });
      }
    }
  }
  lines.sort((a, b) => a.dist - b.dist);

  const hasPaddle = {};
  const paddles = [];

  for (let { i, j } of lines.slice(0, maxPaddles)) {
    if (hasPaddle[i] || hasPaddle[j]) {
      continue;
    }
    const a = points[i].points[corner];
    const b = points[j].points[corner];
    paddles.push({ a, b });
    hasPaddle[i] = hasPaddle[j] = true;
  }
  return paddles;
}

function updateBall(paddles, { width, height }, dt) {
  const nextX = ball.x + ball.dx * ball.speed * dt;
  const nextY = ball.y + ball.dy * ball.speed * dt;

  if (
    (ball.dx < 0 && nextX < ball.r) ||
    (ball.dx > 0 && nextX > width - ball.r)
  ) {
    ball.dx *= -1;
  }
  if (
    (ball.dy < 0 && nextY < ball.r) ||
    (ball.dy > 0 && nextY > height - ball.r)
  ) {
    ball.dy *= -1;
  }

  ball.x += ball.dx * ball.speed * dt;
  ball.y += ball.dy * ball.speed * dt;
}

(async () => {
  // Get a canvas object for this paper.
  const canvas = await paper.get("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.commit();

  // Get a "supporter canvas", which is a canvas for the entire
  // projection surface.
  const scanvas = await paper.get("supporterCanvas");
  const sctx = scanvas.getContext("2d");

  // Get the paper number of this piece of paper (which should not change).
  const myId = await paper.get("number");

  let t = 0;
  let dt = 12;

  setInterval(async () => {
    t += dt;

    // Get a list of all the papers.
    const papers = await paper.get("papers");

    // Clear out the supporter canvas. We get our own canvas, so we won't
    // interfere with other programs by doing this.
    sctx.clearRect(0, 0, scanvas.width, scanvas.height);
    const paddles = getPaddles(papers, "center");

    // draw paddles
    for (let { a, b } of paddles) {
      sctx.beginPath();
      sctx.moveTo(a.x, a.y);
      sctx.lineTo(b.x, b.y);
      sctx.lineWidth = 8;
      sctx.strokeStyle = "red";
      sctx.stroke();
    }

    // draw ball
    sctx.beginPath();
    sctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    sctx.fillStyle = "steelblue";
    sctx.fill();

    updateBall(paddles, scanvas, dt);

    // Finally, commit to the canvas, which actually renders.
    sctx.commit();
  }, dt);
})();
