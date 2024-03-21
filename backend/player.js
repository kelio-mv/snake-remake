const { PLAYER_INITIAL_LENGTH } = require("./constants");

class Player {
  protected = false;

  constructor(username) {
    this.username = username;
  }

  get apples() {
    return this.body.length > PLAYER_INITIAL_LENGTH && this.body.slice(PLAYER_INITIAL_LENGTH);
  }

  setState(state) {
    Object.assign(this, state);
  }

  collide(point) {
    const head = this.body[0];
    return head.x === point.x && head.y === point.y;
  }
}

module.exports = Player;
