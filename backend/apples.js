import { FIELD_SIZE } from "./constants.js";

class Apples {
  instances = [];

  constructor() {
    this.instances.push(this.generate());
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  get quantity() {
    return this.instances.length;
  }

  generate() {
    const [x, y] = Array.from({ length: 2 }, () => Apples.randomInt(1, FIELD_SIZE - 2) + 0.5);
    return this.instances.some((a) => a.x === x && a.y === y) ? this.generate() : { x, y };
  }

  replace() {
    this.instances = [this.generate()];
    return this.instances[0];
  }

  remove(apple) {
    this.instances = this.instances.filter((a) => a !== apple);
  }

  getState() {
    return this.instances.map(({ x, y }) => [x, y]);
  }
}

export default Apples;
