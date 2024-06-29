import { MAP_SIZE, BLOCK_SIZE } from "./constants.js";

// const LIGHT_COLOR = "#4ade80";
// const DARK_COLOR = "#44cf77";
const LIGHT_COLOR = "#22c55e";
const DARK_COLOR = "#20ba58";

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
