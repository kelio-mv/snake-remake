import { FIELD_SIZE } from "./constants.js";

const PLAYER_SPEED = 10;
const NET_FLOAT_PRECISION = 2;

class Player {
  constructor(socket, nickname) {
    this.socket = socket;
    this.nickname = nickname;
    this.reset();
  }

  reset() {
    this.body = [
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
    ];
    this.direction = "up";
    this.protected = true;
    this.dead = false;
    this.appleCount = 0;
    this.apples = [];
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

  incrementAppleCount() {
    this.appleCount += 1;
  }

  getLength() {
    // Do we still need this?
    return this.body.slice(0, -1).reduce((length, point, index) => {
      const nextPoint = this.body[index + 1];
      const [deltaX, deltaY] = [nextPoint.x - point.x, nextPoint.y - point.y];
      return length + (Math.abs(deltaX) || Math.abs(deltaY));
    }, 0);
  }

  moveTail(deltaTime) {
    const [tail, target] = this.body;
    const targetDist = Math.abs(target.x - tail.x) || Math.abs(target.y - tail.y);
    const deltaPos = Math.min(deltaTime * PLAYER_SPEED, targetDist);
    const timeLeft = deltaTime - deltaPos / PLAYER_SPEED;
    const [deltaX, deltaY] = [
      deltaPos * Math.sign(target.x - tail.x),
      deltaPos * Math.sign(target.y - tail.y),
    ];

    tail.x += deltaX;
    tail.y += deltaY;

    if (tail.x === target.x && tail.y === target.y) {
      this.body.shift();
      /**
       * This condition prevents losing the apple when the tail moves directly to the head,
       * which is the last place an apple can be placed.
       * The apple would be lost because the tail no longer has a target,
       * causing the function to throw an error.
       * This error is intended to be thrown when the tail needs to pass the head to move,
       * which could place apples outside the game field.
       */
      if (timeLeft > 0) {
        this.moveTail(timeLeft);
      }
    }
  }

  unprotect() {
    this.protected = false;
  }

  debugLength() {
    const ideal = 3 + this.appleCount;
    const real = this.getLength();
    const delta = ideal - real;
    console.log("Ideal:", ideal, "Real:", real, "Delta:", delta);
  }

  kill() {
    this.dead = true;
    const roundFloat = (number) => parseFloat(number.toFixed(NET_FLOAT_PRECISION));

    for (let i = 0; i < this.appleCount; i++) {
      if (i > 0) {
        try {
          this.moveTail(1 / PLAYER_SPEED);
        } catch {
          /**
           * This prevents the server from crashing when the tail passes the head by dismissing
           * the remaining apples. However, this may still not be the ideal.
           * Choose either to dismiss apples or reduce the gap between apples to avoid this bug.
           */
          break;
        }
      }
      const tail = this.body[0];
      this.apples.push([roundFloat(tail.x), roundFloat(tail.y)]);
    }
  }

  respawn() {
    this.reset();
  }

  getState() {
    return this.body.map(({ x, y }) => [x, y]);
  }

  setState(body) {
    this.body = body.map(([x, y]) => ({ x, y }));
  }
}

export default Player;
