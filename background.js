import { MAP_SIZE, BLOCK_SIZE } from "./constants.js";

const LIGHT_COLOR = "#16a34a";
const DARK_COLOR = "#149945";

class Background {
  draw(ctx) {
    for (let row = 0; row < MAP_SIZE; row++) {
      for (let col = 0; col < MAP_SIZE; col++) {
        ctx.fillStyle = (row + col) % 2 === 0 ? LIGHT_COLOR : DARK_COLOR;
        ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

export default Background;
