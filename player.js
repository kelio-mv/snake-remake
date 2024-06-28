import { BLOCK_SIZE } from "./constants.js";

const PLAYER_SPEED = 10 * BLOCK_SIZE;
const DIRECTIONS_FROM_KEYS = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  KeyW: "up",
  KeyS: "down",
  KeyA: "left",
  KeyD: "right",
};
const DIRECTION_KEYS = Object.keys(DIRECTIONS_FROM_KEYS);
const MIN_DIRECTION_CHANGE_INTERVAL = BLOCK_SIZE / PLAYER_SPEED;
const OPPOSITE_DIRECTIONS = { up: "down", down: "up", left: "right", right: "left" };

class Player {
  body = [
    { x: BLOCK_SIZE, y: BLOCK_SIZE },
    { x: 10 * BLOCK_SIZE, y: BLOCK_SIZE },
  ];
  direction = "right";
  lastDirectionChange = null;

  constructor() {
    addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    if (!DIRECTION_KEYS.includes(e.code)) {
      return;
    }

    const now = Date.now() / 1000;
    const deltaTime = now - this.lastDirectionChange;

    if (deltaTime < MIN_DIRECTION_CHANGE_INTERVAL) {
      return;
    }

    const direction = DIRECTIONS_FROM_KEYS[e.code];
    const playerOppositeDirection = OPPOSITE_DIRECTIONS[this.direction];

    if ([this.direction, playerOppositeDirection].includes(direction)) {
      return;
    }

    this.direction = direction;
    this.lastDirectionChange = now;
    this.body.push({ ...this.body.at(-1) });
  }

  moveHead(deltaTime) {
    const head = this.body.at(-1);
    const deltaPos = deltaTime * PLAYER_SPEED;
    const [deltaX, deltaY] = {
      up: [0, -deltaPos],
      down: [0, deltaPos],
      left: [-deltaPos, 0],
      right: [deltaPos, 0],
    }[this.direction];

    head.x += deltaX;
    head.y += deltaY;
  }

  moveTail(deltaTime) {
    const [tail, target] = this.body;
    const targetDist = Math.abs(target.x - tail.x) + Math.abs(target.y - tail.y);
    const deltaPos = Math.min(deltaTime * PLAYER_SPEED, targetDist);
    const remainingTime = deltaTime - deltaPos / PLAYER_SPEED;
    const [deltaX, deltaY] = [
      deltaPos * Math.sign(target.x - tail.x),
      deltaPos * Math.sign(target.y - tail.y),
    ];

    tail.x += deltaX;
    tail.y += deltaY;

    if (tail.x === target.x && tail.y === target.y) {
      this.body.shift();
      this.moveTail(remainingTime);
    }
  }

  update(deltaTime) {
    this.moveHead(deltaTime);
    this.moveTail(deltaTime);
  }

  draw(ctx) {
    ctx.fillStyle = "#2563eb";
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = BLOCK_SIZE;
    const head = this.body.at(-1);

    this.body.forEach((circle, index) => {
      if (circle === head) {
        ctx.fillStyle = "#1e40af";
      }
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, BLOCK_SIZE / 2, 0, 2 * Math.PI);
      ctx.fill();

      if (circle === head) {
        return;
      }
      const nextCircle = this.body[index + 1];
      ctx.beginPath();
      ctx.moveTo(circle.x, circle.y);
      ctx.lineTo(nextCircle.x, nextCircle.y);
      ctx.stroke();
    });
  }
}

export default Player;
