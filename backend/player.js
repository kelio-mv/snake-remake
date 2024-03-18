const {
  BLOCK_SIZE,
  PLAYER_INITIAL_LENGTH,
  PLAYER_INITIAL_POSITION,
  PLAYER_INITIAL_DIRECTION,
} = require("./constants");

class Player {
  body = Array.from({ length: PLAYER_INITIAL_LENGTH }, () => PLAYER_INITIAL_POSITION);
  direction = PLAYER_INITIAL_DIRECTION;
  protected = false;
  unfocused = false;

  constructor(username) {
    this.username = username;
  }

  setState(state) {
    Object.assign(this, state);
  }

  update() {
    this.body.unshift({ ...this.body[0] });
    this.body.pop();

    const head = this.body[0];
    const move = {
      up: () => (head.y -= BLOCK_SIZE),
      down: () => (head.y += BLOCK_SIZE),
      left: () => (head.x -= BLOCK_SIZE),
      right: () => (head.x += BLOCK_SIZE),
    }[this.direction];
    move();
  }

  collide(point) {
    const head = this.body[0];
    return head.x === point.x && head.y === point.y;
  }

  collideArray(array) {
    for (const point of array) {
      if (this.collide(point)) {
        return true;
      }
    }
  }

  increaseLength() {
    const lastElement = this.body[this.body.length - 1];
    this.body.push({ ...lastElement });
  }

  respawn() {
    this.body = Array.from({ length: PLAYER_INITIAL_LENGTH }, () => PLAYER_INITIAL_POSITION);
    this.direction = PLAYER_INITIAL_DIRECTION;
  }
}

module.exports = Player;
