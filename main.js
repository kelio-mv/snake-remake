import Background from "./background.js";
import Player from "./player.js";
import Apples from "./apples.js";
import { BLOCK_SIZE, CANVAS_SIZE } from "./constants.js";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const background = new Background();
const player = new Player();
const apples = new Apples();
const game = {
  lastUpdate: Date.now() / 1000,
};

function resizeCanvas() {
  const minScale = Math.min(innerWidth / canvas.width, innerHeight / canvas.height);
  canvas.style.width = minScale * canvas.width + "px";
  canvas.style.height = minScale * canvas.height + "px";
}

function update() {
  const now = Date.now() / 1000;
  const deltaTime = now - game.lastUpdate;
  game.lastUpdate = now;
  player.update(deltaTime);

  if (player.collideApple(apples.apple)) {
    player.deltaLength += BLOCK_SIZE;
    apples.replace();
  }

  background.draw(ctx);
  player.draw(ctx);
  apples.draw(ctx);
  requestAnimationFrame(update);
}

addEventListener("resize", resizeCanvas);

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
resizeCanvas();
update();
