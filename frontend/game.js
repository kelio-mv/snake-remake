import Background from "./background.js";
import LocalPlayer from "./local-player.js";
import RemotePlayers from "./remote-players.js";
import Apples from "./apples.js";
import socket from "./socket.js";
import { BLOCK_SIZE, MAP_SIZE, UPDATE_INTERVAL } from "./constants.js";

const gamePage = document.getElementById("game-page");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const background = new Background();
const localPlayer = new LocalPlayer(socket);
const remotePlayers = new RemotePlayers();
const apples = new Apples();
let lastUpdateTime;
let running = false;

window.onresize = resize;
// window.onblur = () => {
//   socket.emit("blur");
//   outdated = true;
// };
window.onfocus = () => {
  lastUpdateTime = Date.now() / 1000;
  // socket.emit("focus", (localPlayerState) => {
  //   localPlayer.setState(localPlayerState);
  //   lastUpdateTime = Date.now() / 1000;
  //   outdated = false;
  // });
};

socket.on("update_player", remotePlayers.setState);
socket.on("replace_apple", (apple, newApple, increaseLength) => {
  apples.replace(apple, newApple);
  if (increaseLength) localPlayer.increaseLength();
});
socket.on("respawn", localPlayer.respawn);
socket.on("player_disconnect", remotePlayers.removePlayer);

canvas.width = BLOCK_SIZE * MAP_SIZE;
canvas.height = BLOCK_SIZE * MAP_SIZE;

resize();

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
  socket.emit("get_apples", apples.set);
  lastUpdateTime = Date.now() / 1000;
  running = true;
  update();
}
function handleDisconnect() {
  running = false;
  localPlayer.respawn();
  apples.clear();
  gamePage.hidden = true;
}

export { handleConnect, handleDisconnect };

/*
otimizar transferência de dados de jogador
adicionar sons/música
adicionar scoreboard
adicionar bots
*/
