import Background from "./background.js";
import Player from "./player.js";
import Apples from "./apples.js";
import { FIELD_SIZE } from "./constants.js";
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const background = new Background();
const player = new Player();
const apples = new Apples();
const game = { lastUpdate: Date.now() / 1000 };
const socket = io("ws://localhost:3000");

function resize() {
  const canvasSize = Math.min(innerWidth, innerHeight) * devicePixelRatio;
  const scaleFactor = canvasSize / FIELD_SIZE;

  canvas.width = canvasSize;
  canvas.height = canvasSize;
  ctx.scale(scaleFactor, scaleFactor);
}

function update() {
  const now = Date.now() / 1000;
  const deltaTime = now - game.lastUpdate;

  player.update(deltaTime);

  if (player.collideApple(apples.apple)) {
    player.grow();
    apples.replace();
  }
  if (player.collideItself() || player.collideEdges()) {
    player.respawn();
  }

  game.lastUpdate = now;
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

addEventListener("resize", resize);

resize();
loop();
