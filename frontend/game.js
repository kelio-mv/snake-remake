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
const state = { lastUpdate: null, animationFrame: null };

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

  localPlayer.update(deltaTime);
  socket.emit("set_player", localPlayer.getState());

  background.draw(ctx);
  localPlayer.draw(ctx);
  remotePlayers.draw(ctx);
  apple.draw(ctx);

  state.lastUpdate = now;
  state.animationFrame = requestAnimationFrame(update);
}

function start() {
  addEventListener("keydown", localPlayer.handleKeyDown);
  addEventListener("touchstart", localPlayer.handleTouchStart);
  addEventListener("touchmove", localPlayer.handleTouchMove);
  state.lastUpdate = Date.now() / 1000;
  state.animationFrame = requestAnimationFrame(update);
}

function stop() {
  removeEventListener("keydown", localPlayer.handleKeyDown);
  removeEventListener("touchstart", localPlayer.handleTouchStart);
  removeEventListener("touchmove", localPlayer.handleTouchMove);
  cancelAnimationFrame(state.animationFrame);
}

function setup() {
  socket.on("set_apple", (state, grow) => {
    apple.setState(...state);
    if (grow) {
      localPlayer.grow();
    }
  });

  socket.on("set_player", (nickname, state) => {
    remotePlayers.setPlayerState(nickname, state);
  });

  socket.on("remove_player", (nickname) => {
    remotePlayers.removePlayer(nickname);
  });

  socket.on("respawn", () => {
    localPlayer.respawn();
    socket.emit("respawn");
  });

  addEventListener("resize", resize);

  resize();
}

setup();

export { start as startGame, stop as stopGame };
