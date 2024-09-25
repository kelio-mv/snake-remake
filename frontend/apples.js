import { BORDER_WIDTH } from "./constants.js";

const APPLE_COLOR = "#dc2626";
const APPLE_BORDER_COLOR = "#000";

class Apples {
  instances = [];

  add(instances) {
    this.instances.push(...instances.map(([x, y]) => ({ x, y })));
  }

  remove(appleIndex, subApple) {
    if (subApple) {
      const [x, y] = subApple;
      this.instances[appleIndex] = { x, y };
    } else {
      this.instances.splice(appleIndex, 1);
    }
  }

  removeAll() {
    this.instances = [];
  }

  draw(ctx) {
    this.instances.forEach((apple) => {
      ctx.beginPath();
      ctx.arc(apple.x, apple.y, 0.5, 0, 2 * Math.PI);
      ctx.fillStyle = APPLE_BORDER_COLOR;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(apple.x, apple.y, 0.5 - BORDER_WIDTH, 0, 2 * Math.PI);
      ctx.fillStyle = APPLE_COLOR;
      ctx.fill();
    });
  }
}

export default Apples;
