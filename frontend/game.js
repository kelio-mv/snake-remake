import Background from "./background.js";
import LocalPlayer from "./local-player.js";
import RemotePlayers from "./remote-players.js";
import Apple from "./apple.js";
import socket from "./socket.js";
import { FIELD_SIZE } from "./constants.js";

const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const background = new Background();
const localPlayer = new LocalPlayer();
const remotePlayers = new RemotePlayers();
const apple = new Apple();

function resize() {
  const canvasSize = Math.min(innerWidth, innerHeight) * devicePixelRatio;
  const scaleFactor = canvasSize / FIELD_SIZE;

  canvas.width = canvasSize;
  canvas.height = canvasSize;
  ctx.scale(scaleFactor, scaleFactor);
}

function update(deltaTime) {
  localPlayer.update(deltaTime);
  socket.emit("set_player", localPlayer.getState());
}

function draw() {
  background.draw(ctx);
  localPlayer.draw(ctx);
  remotePlayers.draw(ctx);
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
  addEventListener("keydown", localPlayer.handleKeyDown);
  addEventListener("touchstart", localPlayer.handleTouchStart);
  addEventListener("touchmove", localPlayer.handleTouchMove);
  addEventListener("resize", resize);

  socket.on("set_apple", (state, grow) => {
    apple.setState(...state);
    if (grow) {
      localPlayer.grow();
    }
  });

  socket.on("set_player", (nickname, state) => {
    remotePlayers.setPlayerState(nickname, state);
  });

  socket.on("respawn", () => {
    localPlayer.respawn();
    socket.emit("respawn");
  });

  resize();
  loop();
}

export default init;
