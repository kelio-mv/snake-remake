import { FIELD_SIZE } from "./constants.js";

class Apple {
  instance = this.generate();

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generate() {
    const [x, y] = [Apple.randomInt(1, FIELD_SIZE - 2), Apple.randomInt(1, FIELD_SIZE - 2)];
    return { x: x + 0.5, y: y + 0.5 };
  }

  replace() {
    this.instance = this.generate();
  }

  getState() {
    return [this.instance.x, this.instance.y];
  }
}

export default Apple;
