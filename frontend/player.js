import { FIELD_SIZE, BORDER_WIDTH } from "./constants.js";

const PLAYER_SPEED = 10;

class Player {
  constructor(color, _protected = true) {
    // setting a default value for protected looks weird
    this.color = color;
    this.protected = _protected;
    this.reset();
  }

  reset() {
    this.body = [
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
    ];
    this.direction = "up";
    this.deltaLength = 3;
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

  grow() {
    this.deltaLength += 1;
  }

  respawn() {
    this.reset();
    this.protected = true;
  }

  disableProtection() {
    this.protected = false;
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
    if (this.protected) {
      ctx.globalAlpha = 0.5;
    }

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

    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
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

    ctx.globalAlpha = 1;
  }

  getState() {
    return [this.body, this.direction, this.deltaLength];
  }
}

export default Player;
