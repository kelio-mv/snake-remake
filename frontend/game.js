import Background from "./background.js";
import LocalPlayer from "./local-player.js";
import RemotePlayers from "./remote-players.js";
import Apples from "./apples.js";
import socket from "./socket.js";
import { FIELD_SIZE } from "./constants.js";

const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const background = new Background();
const localPlayer = new LocalPlayer();
const remotePlayers = new RemotePlayers();
const apples = new Apples();
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
  apples.draw(ctx);

  state.lastUpdate = now;
  state.animationFrame = requestAnimationFrame(update);
}

function start(nickname) {
  localPlayer.setNickname(nickname);
  addEventListener("keydown", localPlayer.handleKeyDown);
  addEventListener("touchstart", localPlayer.handleTouchStart);
  addEventListener("touchmove", localPlayer.handleTouchMove);
  state.lastUpdate = Date.now() / 1000;
  state.animationFrame = requestAnimationFrame(update);
}

function stop() {
  cancelAnimationFrame(state.animationFrame);
  removeEventListener("keydown", localPlayer.handleKeyDown);
  removeEventListener("touchstart", localPlayer.handleTouchStart);
  removeEventListener("touchmove", localPlayer.handleTouchMove);
  localPlayer.reset();
  remotePlayers.removeAll();
  apples.removeAll();
}

function setup() {
  socket.on("apples_add", (instances) => {
    apples.add(instances);
  });

  socket.on("apples_remove", (appleIndex, subApple, grow) => {
    apples.remove(appleIndex, subApple);
    if (grow) {
      localPlayer.grow();
    }
  });

  socket.on("player", (nickname, state) => {
    remotePlayers.setState(nickname, state);
  });

  socket.on("player_add", (nickname, state, unprotected) => {
    remotePlayers.add(nickname, state, unprotected);
  });

  socket.on("player_disconnect", (nickname) => {
    remotePlayers.remove(nickname);
  });

  socket.on("protection_end", (nickname) => {
    if (nickname) {
      remotePlayers.disableProtection(nickname);
    } else {
      localPlayer.disableProtection();
    }
  });

  socket.on("respawn", (nickname) => {
    if (nickname) {
      remotePlayers.reset(nickname);
    } else {
      localPlayer.reset();
      socket.emit("respawn");
    }
  });

  addEventListener("resize", resize);

  resize();
}

setup();

export { start as startGame, stop as stopGame };

// drop players' apples on death
// sounds and music
// display "nickname already in use" warning outside the browser 'alert' window
// improve socket.io event names
// maybe different colors for players
// maybe different spawn points
// maybe unify constants and classes between client and server
// decide how to properly handle disconnections and reconnections
// decide how to properly optimize data transfer in order to reduce lag
