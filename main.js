import Player from "./player.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const player = new Player();
const game = {
  lastUpdate: Date.now() / 1000,
};

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function update() {
  const now = Date.now() / 1000;
  const deltaTime = now - game.lastUpdate;
  game.lastUpdate = now;
  player.update(deltaTime);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);
  requestAnimationFrame(update);
}

addEventListener("resize", resizeCanvas);

resizeCanvas();
update();
