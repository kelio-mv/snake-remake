import Background from "./background.js";
import LocalPlayer from "./local-player.js";
import RemotePlayers from "./remote-players.js";
import Apples from "./apples.js";
import RespawnOverlay from "./respawn-overlay.js";
import InputManager from "./input-manager.js";
import socket from "./socket.js";
import sounds from "./sounds.js";
import { FIELD_SIZE } from "./constants.js";

const canvas = document.querySelector(".game-canvas");
const ctx = canvas.getContext("2d");
const background = new Background();
const localPlayer = new LocalPlayer();
const remotePlayers = new RemotePlayers();
const apples = new Apples();
const respawnOverlay = new RespawnOverlay();
const inputManager = new InputManager();
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
  respawnOverlay.draw(ctx);

  state.lastUpdate = now;
  state.animationFrame = requestAnimationFrame(update);
}

function start(nickname) {
  localPlayer.setNickname(nickname);
  inputManager.addEventListeners();
  state.lastUpdate = Date.now() / 1000;
  state.animationFrame = requestAnimationFrame(update);
}

function stop() {
  cancelAnimationFrame(state.animationFrame);
  inputManager.removeEventListeners();
  localPlayer.reset();
  remotePlayers.removeAll();
  respawnOverlay.setVisible(false);
  apples.removeAll();
}

function setup() {
  socket.on("player", (nickname, state) => {
    remotePlayers.setState(nickname, state);
  });

  socket.on("player_add", (nickname, state, unprotected, dead) => {
    remotePlayers.add(nickname, state, unprotected, dead);
  });

  socket.on("player_remove", (nickname) => {
    remotePlayers.remove(nickname);
  });

  socket.on("player_disable_protection", (nickname) => {
    if (nickname) {
      remotePlayers.disableProtection(nickname);
    } else {
      localPlayer.disableProtection();
    }
  });

  socket.on("player_kill", (nickname) => {
    if (nickname) {
      remotePlayers.kill(nickname);
    } else {
      localPlayer.kill();
      respawnOverlay.setVisible(true);
    }
    sounds.playerCollide.play();
  });

  socket.on("player_respawn", (nickname) => {
    remotePlayers.respawn(nickname);
  });

  socket.on("apples_add", (instances) => {
    apples.add(instances);
  });

  socket.on("apples_remove", (appleIndex, subApple, grow) => {
    apples.remove(appleIndex, subApple);
    if (grow) {
      localPlayer.grow();
    }
    sounds.playerEat.play();
  });

  addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      // Prevent player from teleporting to avoid unfair collisions for their opponents
      // This also fixes the bug where the player drops their apples outside the field
      state.lastUpdate = Date.now() / 1000;
    }
  });
  addEventListener("resize", resize);
  resize();
}

setup();

export { start as startGame, stop as stopGame, localPlayer, respawnOverlay };

// improve controls for mobile
// make a respawn button instead?
// try different colors for players
// try different spawn points
// credits and tutorial
// unify constants and classes between client and server
// decide how to properly handle disconnections and reconnections
// decide how to properly optimize data transfer in order to reduce lag
// review all the code
