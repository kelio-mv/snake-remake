const { BLOCK_SIZE, MAP_SIZE } = require("./constants");
const APPLE_QUANTITY = 12;

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Apples {
  apples = [];

  constructor() {
    for (let n = 0; n < APPLE_QUANTITY; n++) {
      this.apples.push(this.create());
    }
  }

  create = () => {
    const [x, y] = [randint(1, MAP_SIZE - 2), randint(1, MAP_SIZE - 2)];
    const apple = { x: x * BLOCK_SIZE, y: y * BLOCK_SIZE };

    if (this.apples.some(({ x, y }) => x === apple.x && y === apple.y)) {
      return this.create();
    } else {
      return apple;
    }
  };

  replace(apple) {
    const index = this.apples.indexOf(apple);
    const newApple = this.create();
    this.apples[index] = newApple;
    return newApple;
  }
}

module.exports = Apples;
