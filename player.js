import { BLOCK_SIZE } from "./constants.js";

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
const OPPOSITE_DIRECTIONS = { up: "down", down: "up", left: "right", right: "left" };
const PLAYER_SPEED = 10 * BLOCK_SIZE;
const MIN_DIRECTION_CHANGE_INTERVAL = BLOCK_SIZE / PLAYER_SPEED;

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

  update(deltaTime) {
    const [tail, tailTarget] = this.body;
    const targetDistance = Math.abs(tailTarget.x - tail.x + tailTarget.y - tail.y);
    const deltaPosition = Math.min(deltaTime * PLAYER_SPEED, targetDistance);
    const remainingTime = deltaTime - deltaPosition / PLAYER_SPEED;
    const [tailDeltaX, tailDeltaY] = [
      deltaPosition * Math.sign(tailTarget.x - tail.x),
      deltaPosition * Math.sign(tailTarget.y - tail.y),
    ];
    const head = this.body.at(-1);
    const [headDeltaX, headDeltaY] = {
      up: [0, -deltaPosition],
      down: [0, deltaPosition],
      left: [-deltaPosition, 0],
      right: [deltaPosition, 0],
    }[this.direction];

    tail.x += tailDeltaX;
    tail.y += tailDeltaY;
    head.x += headDeltaX;
    head.y += headDeltaY;

    if (tail.x === tailTarget.x && tail.y === tailTarget.y) {
      this.body.shift();
      this.update(remainingTime);
    }
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
