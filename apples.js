import { BLOCK_SIZE, MAP_SIZE } from "./constants.js";

const APPLE_COLOR = "#dc2626";

class Apples {
  apple = this.create();

  static randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  create() {
    const [x, y] = [Apples.randint(1, MAP_SIZE - 2), Apples.randint(1, MAP_SIZE - 2)];
    return { x: (x + 0.5) * BLOCK_SIZE, y: (y + 0.5) * BLOCK_SIZE };
  }

  replace() {
    this.apple = this.create();
  }

  draw(ctx) {
    ctx.fillStyle = APPLE_COLOR;
    ctx.beginPath();
    ctx.arc(this.apple.x, this.apple.y, BLOCK_SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export default Apples;
