import { BLOCK_SIZE } from "./constants.js";

const APPLE_COLOR = "#dc2626";
const APPLE_MARGIN = 1;
const APPLE_SIZE = BLOCK_SIZE - APPLE_MARGIN * 2;

class Apples {
  apples = [];

  add = (apples) => {
    this.apples.push(...apples);
  };

  replace = (apple, newApple) => {
    const index = this.apples.findIndex(({ x, y }) => x === apple.x && y === apple.y);
    this.apples[index] = newApple;
  };

  destroy(apple) {
    const index = this.apples.findIndex(({ x, y }) => x === apple.x && y === apple.y);
    this.apples.splice(index, 1);
  }

  clear() {
    this.apples = [];
  }

  draw(ctx) {
    this.apples.forEach(({ x, y }) => {
      ctx.fillStyle = APPLE_COLOR;
      ctx.fillRect(x + APPLE_MARGIN, y + APPLE_MARGIN, APPLE_SIZE, APPLE_SIZE);
    });
  }
}

export default Apples;
