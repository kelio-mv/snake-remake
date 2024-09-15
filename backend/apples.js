import { FIELD_SIZE } from "./constants.js";

class Apples {
  instances = [];

  constructor() {
    this.instances.push(this.generate());
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  get() {
    return this.instances.entries();
  }

  generate() {
    const [x, y] = Array.from({ length: 2 }, () => Apples.randomInt(1, FIELD_SIZE - 2) + 0.5);
    return this.instances.some((a) => a.x === x && a.y === y) ? this.generate() : { x, y };
  }

  remove(index) {
    if (this.instances.length === 1) {
      const subApple = this.generate();
      this.instances[0] = subApple;
      return [subApple.x, subApple.y];
    }

    this.instances.splice(index, 1);
  }

  getState() {
    return this.instances.map(({ x, y }) => [x, y]);
  }
}

export default Apples;
