import { BORDER_WIDTH } from "./constants.js";

const APPLE_COLOR = "#dc2626";
const APPLE_BORDER_COLOR = "#000";

class Apples {
  instances = [];

  setInitialState(instances) {
    this.instances = instances.map(([x, y]) => ({ x, y }));
  }

  add(playerApples) {
    this.instances.push(...playerApples.map(([x, y]) => ({ x, y })));
  }

  remove(appleIndex, subApple) {
    if (subApple) {
      const [x, y] = subApple;
      this.instances[appleIndex] = { x, y };
    } else {
      this.instances.splice(appleIndex, 1);
    }
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
