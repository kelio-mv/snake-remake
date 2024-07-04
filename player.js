import { BLOCK_SIZE, CANVAS_SIZE } from "./constants.js";

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
    { x: CANVAS_SIZE / 2, y: CANVAS_SIZE - BLOCK_SIZE / 2 },
    { x: CANVAS_SIZE / 2, y: CANVAS_SIZE - 15 * BLOCK_SIZE },
  ];
  direction = "up";
  lastDirectionChange = null;
  touchStart = null;

  constructor() {
    addEventListener("keydown", this.handleKeyDown.bind(this));
    addEventListener("touchstart", this.handleTouchStart.bind(this));
    addEventListener("touchmove", this.handleTouchMove.bind(this));
  }

  handleKeyDown(e) {
    if (!DIRECTION_KEYS.includes(e.code)) {
      return;
    }

    const direction = DIRECTIONS_FROM_KEYS[e.code];
    this.setDirection(direction);
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    this.touchStart = { x: touch.clientX, y: touch.clientY };
  }

  handleTouchMove(e) {
    if (this.touchStart === null) {
      return;
    }

    const touch = e.touches[0];
    const [deltaX, deltaY] = [touch.clientX - this.touchStart.x, touch.clientY - this.touchStart.y];

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.setDirection(deltaX > 0 ? "right" : "left");
    } else {
      this.setDirection(deltaY > 0 ? "down" : "up");
    }

    this.touchStart = null;
  }

  setDirection(direction) {
    const now = Date.now() / 1000;
    const deltaTime = now - this.lastDirectionChange;

    if (deltaTime < MIN_DIRECTION_CHANGE_INTERVAL) {
      return;
    }
    if ([this.direction, OPPOSITE_DIRECTIONS[this.direction]].includes(direction)) {
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

  respawn() {
    this.body = [
      { x: CANVAS_SIZE / 2, y: CANVAS_SIZE - BLOCK_SIZE / 2 },
      { x: CANVAS_SIZE / 2, y: CANVAS_SIZE - 15 * BLOCK_SIZE },
    ];
    this.direction = "up";
    this.lastDirectionChange = null;
  }

  update(deltaTime) {
    this.moveHead(deltaTime);
    this.moveTail(deltaTime);
    // Collision with edges
    const head = this.body.at(-1);
    if (
      head.x <= BLOCK_SIZE / 2 ||
      head.x >= CANVAS_SIZE - BLOCK_SIZE / 2 ||
      head.y <= BLOCK_SIZE / 2 ||
      head.y >= CANVAS_SIZE - BLOCK_SIZE / 2
    ) {
      this.respawn();
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#38bdf8";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = BLOCK_SIZE;

    this.body.forEach((circle, index) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, BLOCK_SIZE / 2, 0, 2 * Math.PI);
      ctx.fill();

      if (circle === this.body.at(-1)) {
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
