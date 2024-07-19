import { FIELD_SIZE } from "./constants.js";

const LIGHT_COLOR = "#16a34a";
const DARK_COLOR = "#149945";

class Background {
  draw(ctx) {
    for (let y = 0; y < FIELD_SIZE; y++) {
      for (let x = 0; x < FIELD_SIZE; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? LIGHT_COLOR : DARK_COLOR;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

export default Background;
