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
  socket.emit("update", localPlayer.getState());

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
  socket.on("apple", (state, grow) => {
    apple.setState(...state);
    if (grow) {
      localPlayer.grow();
    }
  });

  socket.on("player", (nickname, state) => {
    remotePlayers.setPlayerState(nickname, state);
  });

  socket.on("player_respawn", (nickname) => {
    remotePlayers.respawnPlayer(nickname);
  });

  socket.on("player_immunity_expire", (nickname) => {
    remotePlayers.removePlayerImmunity(nickname);
  });

  socket.on("player_connect", (nickname) => {
    remotePlayers.addPlayer(nickname);
  });

  socket.on("player_disconnect", (nickname) => {
    remotePlayers.removePlayer(nickname);
  });

  socket.on("immunity_expire", () => {
    localPlayer.removeImmunity();
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

// add respawn immunity
// display players' nicknames
// display "nickname already in use" warning without the function alert
// sounds and music
// maybe different colors for players
// decide how to properly handle disconnections and reconnections
// decide how to properly optimize data transfer in order to reduce lag
// improve socket.io event names
// improve immune player drawing by changing start and end angles
