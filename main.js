import Player from "./player.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const player = new Player();

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  player.draw(ctx);
  requestAnimationFrame(update);
}

addEventListener("resize", resizeCanvas);

resizeCanvas();
update();
