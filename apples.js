import { FIELD_SIZE, BORDER_WIDTH } from "./constants.js";

const APPLE_COLOR = "#dc2626";
const APPLE_BORDER_COLOR = "#000";

class Apples {
  apple = this.create();

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  create() {
    const [x, y] = [Apples.randomInt(1, FIELD_SIZE - 2), Apples.randomInt(1, FIELD_SIZE - 2)];
    return { x: x + 0.5, y: y + 0.5 };
  }

  replace() {
    this.apple = this.create();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.apple.x, this.apple.y, 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = APPLE_BORDER_COLOR;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.apple.x, this.apple.y, 0.5 - BORDER_WIDTH, 0, 2 * Math.PI);
    ctx.fillStyle = APPLE_COLOR;
    ctx.fill();
  }
}

export default Apples;
