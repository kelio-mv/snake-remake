import Background from "./background.js";
import Player from "./player.js";
import Apple from "./apple.js";
import socket from "./socket.js";
import { FIELD_SIZE } from "./constants.js";

const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const background = new Background();
const player = new Player();
const apple = new Apple();

function resize() {
  const canvasSize = Math.min(innerWidth, innerHeight) * devicePixelRatio;
  const scaleFactor = canvasSize / FIELD_SIZE;

  canvas.width = canvasSize;
  canvas.height = canvasSize;
  ctx.scale(scaleFactor, scaleFactor);
}

function update(deltaTime) {
  player.update(deltaTime);
  socket.emit("set_player", player.getState());
}

function draw() {
  background.draw(ctx);
  player.draw(ctx);
  apple.draw(ctx);
}

function loop(lastTick) {
  const now = Date.now() / 1000;
  const deltaTime = lastTick ? now - lastTick : 0;

  update(deltaTime);
  draw();
  requestAnimationFrame(() => loop(now));
}

function init() {
  addEventListener("keydown", player.handleKeyDown);
  addEventListener("touchstart", player.handleTouchStart);
  addEventListener("touchmove", player.handleTouchMove);
  addEventListener("resize", resize);

  socket.on("set_apple", (state, grow) => {
    apple.set(...state);
    if (grow) {
      player.grow();
    }
  });

  socket.on("respawn", () => {
    player.respawn();
    socket.emit("respawn");
  });

  resize();
  loop();
}

export default init;
