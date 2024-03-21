import Background from "./background.js";
import LocalPlayer from "./local-player.js";
import RemotePlayers from "./remote-players.js";
import Apples from "./apples.js";
import socket from "./socket.js";
import { BLOCK_SIZE, MAP_WIDTH, MAP_HEIGHT, UPDATE_INTERVAL } from "./constants.js";

const gamePage = document.getElementById("game-page");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const background = new Background();
const localPlayer = new LocalPlayer();
const remotePlayers = new RemotePlayers();
const apples = new Apples();
const sounds = {
  increaseLength: new Audio("assets/increase-length.mp3"),
  respawn: new Audio("assets/respawn.mp3"),
};
let lastUpdateTime;
let running = false;

function resize() {
  const widthScale = innerWidth / canvas.width;
  const heightScale = innerHeight / canvas.height;
  const scale = Math.min(widthScale, heightScale);
  canvas.style.width = canvas.width * scale + "px";
  canvas.style.height = canvas.height * scale + "px";
}

function update() {
  if (!running) return;

  const now = Date.now() / 1000;
  const deltaTime = now - lastUpdateTime;

  if (deltaTime >= UPDATE_INTERVAL) {
    localPlayer.update();
    lastUpdateTime += UPDATE_INTERVAL;
  }

  background.draw(ctx, canvas);
  apples.draw(ctx);
  remotePlayers.draw(ctx);
  localPlayer.draw(ctx);
  requestAnimationFrame(update);
}

function handleConnect() {
  gamePage.hidden = false;
  document.documentElement.requestFullscreen();
  screen.orientation.lock("landscape");
  lastUpdateTime = Date.now() / 1000;
  running = true;
  update();
}

function handleDisconnect() {
  gamePage.hidden = true;
  localPlayer.respawn();
  apples.clear();
  running = false;
}

window.onresize = resize;
window.onfocus = () => {
  const now = Date.now() / 1000;
  const deltaTime = now - lastUpdateTime;

  if (deltaTime >= 2 * UPDATE_INTERVAL) {
    lastUpdateTime = Date.now() / 1000;
  }
};

socket.on("add_apples", apples.add);
socket.on("update_player", (player) => {
  remotePlayers.setState(player);
  if (player.protected) {
    sounds.respawn.currentTime = 0;
    sounds.respawn.play();
  }
});
socket.on("replace_apple", (apple, newApple, increaseLength) => {
  if (newApple) {
    apples.replace(apple, newApple);
  } else {
    apples.destroy(apple);
  }
  if (increaseLength) {
    localPlayer.increaseLength();
  }
  sounds.increaseLength.currentTime = 0;
  sounds.increaseLength.play();
});
socket.on("respawn", () => {
  localPlayer.respawn();
  sounds.respawn.currentTime = 0;
  sounds.respawn.play();
});
socket.on("player_disconnect", remotePlayers.removePlayer);

canvas.width = BLOCK_SIZE * MAP_WIDTH;
canvas.height = BLOCK_SIZE * MAP_HEIGHT;

resize();

export { handleConnect, handleDisconnect };
