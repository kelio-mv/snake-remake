import { FIELD_SIZE, BORDER_WIDTH } from "./constants.js";

const PLAYER_SPEED = 10;
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

class Player {
  body = null;
  direction = null;
  deltaLength = null;
  touchStart = null;

  constructor() {
    this.reset();
    addEventListener("keydown", this.handleKeyDown.bind(this));
    addEventListener("touchstart", this.handleTouchStart.bind(this));
    addEventListener("touchmove", this.handleTouchMove.bind(this));
  }

  setDirection(direction) {
    if ([this.direction, OPPOSITE_DIRECTIONS[this.direction]].includes(direction)) {
      return;
    }
    if (this.body.length > 2) {
      const [lastTurn, head] = this.body.slice(-2);
      const deltaPos = Math.abs(head.x - lastTurn.x) + Math.abs(head.y - lastTurn.y);

      if (deltaPos < 1) {
        return;
      }
    }

    this.direction = direction;
    this.body.push({ ...this.body.at(-1) });
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

  handleGrowth(deltaTime) {
    const deltaPos = deltaTime * PLAYER_SPEED;
    this.deltaLength -= deltaPos;

    if (this.deltaLength < 0) {
      const remainingTime = -this.deltaLength / PLAYER_SPEED;
      this.moveTail(remainingTime);
      this.deltaLength = 0;
    }
  }

  collideRect(rect) {
    const head = { ...this.body.at(-1), width: 1, height: 1 };

    return (
      head.x < rect.x + rect.width &&
      head.x + head.width > rect.x &&
      head.y < rect.y + rect.height &&
      head.y + head.height > rect.y
    );
  }

  collideApple(apple) {
    return this.collideRect({ x: apple.x, y: apple.y, width: 1, height: 1 });
  }

  collideItself() {
    for (let i = 0; i < this.body.length - 4; i++) {
      const [point, nextPoint] = this.body.slice(i, i + 2);
      const [deltaX, deltaY] = [nextPoint.x - point.x, nextPoint.y - point.y];
      const rect = {
        x: point.x,
        y: point.y,
        width: Math.abs(deltaX) + 1,
        height: Math.abs(deltaY) + 1,
      };

      if (deltaX < 0 || deltaY < 0) {
        [rect.x, rect.y] = [nextPoint.x, nextPoint.y];
      }

      if (this.collideRect(rect)) {
        return true;
      }
    }
  }

  collideEdges() {
    const head = this.body.at(-1);

    return head.x < 0.5 || head.x > FIELD_SIZE - 0.5 || head.y < 0.5 || head.y > FIELD_SIZE - 0.5;
  }

  grow() {
    this.deltaLength += 1;
  }

  reset() {
    this.body = [
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
    ];
    this.direction = "up";
    this.deltaLength = 3;
  }

  respawn() {
    this.reset();
  }

  update(deltaTime) {
    this.moveHead(deltaTime);

    if (this.deltaLength > 0) {
      this.handleGrowth(deltaTime);
    } else {
      this.moveTail(deltaTime);
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    this.body.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 0.5, 0, 2 * Math.PI);
      ctx.fill();

      if (point === this.body.at(-1)) {
        return;
      }
      const nextPoint = this.body[index + 1];
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(nextPoint.x, nextPoint.y);
      ctx.stroke();
    });

    ctx.fillStyle = "#38bdf8";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1 - 2 * BORDER_WIDTH;

    this.body.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 0.5 - BORDER_WIDTH, 0, 2 * Math.PI);
      ctx.fill();

      if (point === this.body.at(-1)) {
        return;
      }
      const nextPoint = this.body[index + 1];
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(nextPoint.x, nextPoint.y);
      ctx.stroke();
    });
  }
}

export default Player;
