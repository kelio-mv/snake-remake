import Background from "./background.js";
import Player from "./player.js";
import Apples from "./apples.js";
import { FIELD_SIZE } from "./constants.js";

const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const background = new Background();
const player = new Player();
const apples = new Apples();

function resize() {
  const canvasSize = Math.min(innerWidth, innerHeight) * devicePixelRatio;
  const scaleFactor = canvasSize / FIELD_SIZE;

  canvas.width = canvasSize;
  canvas.height = canvasSize;
  ctx.scale(scaleFactor, scaleFactor);
}

function update(deltaTime) {
  player.update(deltaTime);

  if (player.collideApple(apples.apple)) {
    player.grow();
    apples.replace();
  }
  if (player.collideItself() || player.collideEdges()) {
    player.respawn();
  }
}

function draw() {
  background.draw(ctx);
  player.draw(ctx);
  apples.draw(ctx);
}

function loop(lastTick) {
  const now = Date.now() / 1000;
  const deltaTime = lastTick ? now - lastTick : 0;

  update(deltaTime);
  draw();
  requestAnimationFrame(() => loop(now));
}

function init() {
  addEventListener("keydown", player.handleKeyDown.bind(player));
  addEventListener("touchstart", player.handleTouchStart.bind(player));
  addEventListener("touchmove", player.handleTouchMove.bind(player));
  addEventListener("resize", resize);

  resize();
  loop();
}

export default init;
