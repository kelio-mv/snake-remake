class Player {
  protected = false;

  constructor(username) {
    this.username = username;
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
