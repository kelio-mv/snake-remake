import { FIELD_SIZE, BG_LIGHT_COLOR, BG_DARK_COLOR } from "./constants.js";

class Background {
  draw(ctx) {
    for (let y = 0; y < FIELD_SIZE; y++) {
      for (let x = 0; x < FIELD_SIZE; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? BG_LIGHT_COLOR : BG_DARK_COLOR;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

export default Background;
