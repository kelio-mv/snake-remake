import Background from "./background.js";
import Player from "./player.js";
import Apples from "./apples.js";
import { FIELD_SIZE } from "./constants.js";

const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const background = new Background();
const player = new Player();
const apples = new Apples();
const state = { lastUpdate: null };

function resize() {
  const canvasSize = Math.min(innerWidth, innerHeight) * devicePixelRatio;
  const scaleFactor = canvasSize / FIELD_SIZE;

  canvas.width = canvasSize;
  canvas.height = canvasSize;
  ctx.scale(scaleFactor, scaleFactor);
}

function update() {
  const now = Date.now() / 1000;
  const deltaTime = now - state.lastUpdate;

  player.update(deltaTime);

  if (player.collideApple(apples.apple)) {
    player.grow();
    apples.replace();
  }
  if (player.collideItself() || player.collideEdges()) {
    player.respawn();
  }

  state.lastUpdate = now;
}

function draw() {
  background.draw(ctx);
  player.draw(ctx);
  apples.draw(ctx);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function init() {
  addEventListener("keydown", player.handleKeyDown.bind(player));
  addEventListener("touchstart", player.handleTouchStart.bind(player));
  addEventListener("touchmove", player.handleTouchMove.bind(player));
  addEventListener("resize", resize);
  state.lastUpdate = Date.now() / 1000;

  resize();
  loop();
}

export default init;
