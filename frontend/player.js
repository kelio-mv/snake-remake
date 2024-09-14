import { FIELD_SIZE, BORDER_WIDTH } from "./constants.js";

const PLAYER_SPEED = 10;

class Player {
  constructor(color) {
    this.color = color;
    this.reset();
  }

  reset() {
    this.body = [
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
    ];
    this.direction = "up";
    this.deltaLength = 3;
    this.protected = true;
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

    const drawBody = (strokeStyle, lineWidth) => {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.beginPath();

      this.body.slice(0, -1).forEach((point, index) => {
        const nextPoint = this.body[index + 1];
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
      });

      ctx.stroke();
    };

    drawBody("#000", 1);
    drawBody(this.color, 1 - 2 * BORDER_WIDTH);
    ctx.globalAlpha = 1;
  }

  getState() {
    return [this.body, this.direction, this.deltaLength];
  }
}

export default Player;
