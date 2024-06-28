import Player from "./player.js";
import { CANVAS_SIZE } from "./constants.js";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const player = new Player();
const game = {
  lastUpdate: Date.now() / 1000,
};

function resizeCanvas() {
  const widthScale = innerWidth / canvas.width;
  const heightScale = innerHeight / canvas.height;
  const scale = Math.min(widthScale, heightScale);
  canvas.style.width = canvas.width * scale + "px";
  canvas.style.height = canvas.height * scale + "px";
}

function update() {
  const now = Date.now() / 1000;
  const deltaTime = now - game.lastUpdate;
  game.lastUpdate = now;
  player.update(deltaTime);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);
  requestAnimationFrame(update);
}

addEventListener("resize", resizeCanvas);

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
resizeCanvas();
update();
