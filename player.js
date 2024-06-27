const BLOCK_SIZE = 16;
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

class Player {
  body = [
    { x: BLOCK_SIZE, y: BLOCK_SIZE },
    { x: 15 * BLOCK_SIZE, y: BLOCK_SIZE },
  ];
  direction = "right";

  constructor() {
    addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    if (DIRECTION_KEYS.includes(e.code)) {
      this.direction = DIRECTIONS_FROM_KEYS[e.code];
      this.body.push({ ...this.body.at(-1) });
    }
  }

  getHeadDelta() {
    const [x, y] = {
      up: [0, -2],
      down: [0, 2],
      left: [-2, 0],
      right: [2, 0],
    }[this.direction];
    return { x, y };
  }

  getTailDelta() {
    if (this.body.length === 2) {
      return this.getHeadDelta();
    } else {
      const [tail, target] = this.body;
      return { x: 2 * Math.sign(target.x - tail.x), y: 2 * Math.sign(target.y - tail.y) };
    }
  }

  update() {
    const head = this.body.at(-1);
    const tail = this.body[0];
    const headDelta = this.getHeadDelta();
    const tailDelta = this.getTailDelta();

    head.x += headDelta.x;
    head.y += headDelta.y;
    tail.x += tailDelta.x;
    tail.y += tailDelta.y;

    if (this.body.length > 2) {
      const tailTarget = this.body[1];

      if (tail.x === tailTarget.x && tail.y === tailTarget.y) {
        this.body.shift();
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#555";
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2 * BLOCK_SIZE;

    this.body.forEach((circle, index) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, BLOCK_SIZE, 0, 2 * Math.PI);
      ctx.fill();

      if (index === this.body.length - 1) {
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
