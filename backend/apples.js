const { BLOCK_SIZE, MAP_WIDTH, MAP_HEIGHT } = require("./constants");

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Apples {
  apples = [];

  constructor() {
    this.apples.push(this.create());
  }

  get() {
    return this.apples;
  }

  add(apples) {
    this.apples.push(...apples);
  }

  create = () => {
    const [x, y] = [randint(1, MAP_WIDTH - 2), randint(1, MAP_HEIGHT - 2)];
    const apple = { x: x * BLOCK_SIZE, y: y * BLOCK_SIZE };
    if (this.apples.some(({ x, y }) => x === apple.x && y === apple.y)) {
      return this.create();
    }
    return apple;
  };

  replace(apple) {
    const index = this.apples.indexOf(apple);
    const newApple = this.create();
    this.apples[index] = newApple;
    return newApple;
  }
}

module.exports = Apples;
