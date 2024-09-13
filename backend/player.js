import { FIELD_SIZE } from "./constants.js";

const PLAYER_SPEED = 10;

class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.body = [
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
    ];
    this.direction = "up";
    this.deltaLength = 3;
    this.dead = false;
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

  getRects() {
    return this.body.slice(0, -1).map((point, index) => {
      const nextPoint = this.body[index + 1];
      const [deltaX, deltaY] = [nextPoint.x - point.x, nextPoint.y - point.y];

      return {
        x: deltaX > 0 ? point.x : nextPoint.x,
        y: deltaY > 0 ? point.y : nextPoint.y,
        width: Math.abs(deltaX) + 1,
        height: Math.abs(deltaY) + 1,
      };
    });
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

  collidePlayer(player) {
    return player.getRects().some((rect) => this.collideRect(rect));
  }

  collideItself() {
    const rects = this.getRects().slice(0, -3);
    return rects.some((rect) => this.collideRect(rect));
  }

  collideEdges() {
    const head = this.body.at(-1);
    return head.x < 0.5 || head.x > FIELD_SIZE - 0.5 || head.y < 0.5 || head.y > FIELD_SIZE - 0.5;
  }

  collideApple(apple) {
    return this.collideRect({ x: apple.x, y: apple.y, width: 1, height: 1 });
  }

  grow() {
    this.deltaLength += 1;
  }

  update(deltaTime) {
    this.moveHead(deltaTime);

    if (this.deltaLength > 0) {
      this.handleGrowth(deltaTime);
    } else {
      this.moveTail(deltaTime);
    }
  }

  getState() {
    // We don't need to round the numbers yet
    return [this.body.map(({ x, y }) => [x, y]), this.direction, this.deltaLength];
  }

  setState(body, direction, deltaLength) {
    this.body = body.map(([x, y]) => ({ x, y }));
    this.direction = direction;
    this.deltaLength = deltaLength;
  }
}

export default Player;
