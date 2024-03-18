import { BLOCK_SIZE } from "./constants.js";

const APPLE_COLOR = "#dc2626";
const APPLE_BORDER_COLOR = "#450a0a";
const APPLE_BORDER_WIDTH = 1;
const APPLE_SIZE = BLOCK_SIZE - APPLE_BORDER_WIDTH * 2;

class Apples {
  apples = [];

  add = (apples) => {
    this.apples.push(...apples);
  };

  replace = (apple, newApple) => {
    const index = this.apples.findIndex(({ x, y }) => x === apple.x && y === apple.y);
    this.apples[index] = newApple;
  };

  draw(ctx) {
    this.apples.forEach(({ x, y }) => {
      ctx.fillStyle = APPLE_BORDER_COLOR;
      ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
      ctx.fillStyle = APPLE_COLOR;
      ctx.fillRect(x + APPLE_BORDER_WIDTH, y + APPLE_BORDER_WIDTH, APPLE_SIZE, APPLE_SIZE);
    });
  }
}

export default Apples;
