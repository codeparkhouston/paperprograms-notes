// Following: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas

// create canvas
const canvas = document.getElementById("canvas");

// offscreen canvas
const offscreen = canvas.transferControlToOffscreen();

// start worker
const worker = new Worker("worker.js");

// send canvas to worker
worker.postMessage({ canvas: offscreen }, [offscreen]);
