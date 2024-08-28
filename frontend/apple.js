import { FIELD_SIZE, BORDER_WIDTH } from "./constants.js";

const APPLE_COLOR = "#dc2626";
const APPLE_BORDER_COLOR = "#000";

class Apple {
  instance = null;

  setState(x, y) {
    this.instance = { x, y };
  }

  draw(ctx) {
    if (this.instance === null) {
      return;
    }
    ctx.beginPath();
    ctx.arc(this.instance.x, this.instance.y, 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = APPLE_BORDER_COLOR;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.instance.x, this.instance.y, 0.5 - BORDER_WIDTH, 0, 2 * Math.PI);
    ctx.fillStyle = APPLE_COLOR;
    ctx.fill();
  }
}

export default Apple;
