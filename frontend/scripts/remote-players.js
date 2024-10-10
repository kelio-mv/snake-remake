import Player from "./player.js";

const REMOTE_PLAYER_COLOR = "#fb923c";

class RemotePlayer extends Player {
  constructor(nickname, dead, state, unprotected) {
    super(REMOTE_PLAYER_COLOR);
    this.nickname = nickname;

    if (dead) {
      this.kill();
    } else if (state) {
      this.setState(state);

      if (unprotected) {
        this.disableProtection();
      }
    }
  }

  setState(body) {
    this.body = body.map(([x, y]) => ({ x, y }));
  }
}

class RemotePlayers {
  players = [];

  add(nickname, state, unprotected) {
    this.players.push(new RemotePlayer(nickname, state, unprotected));
  }

  remove(nickname) {
    this.players = this.players.filter((player) => player.nickname !== nickname);
  }

  removeAll() {
    this.players = [];
  }

  get(nickname) {
    return this.players.find((player) => player.nickname === nickname);
  }

  setState(nickname, state) {
    this.get(nickname).setState(state);
  }

  disableProtection(nickname) {
    this.get(nickname).disableProtection();
  }

  kill(nickname) {
    this.get(nickname).kill();
  }

  respawn(nickname) {
    this.get(nickname).respawn();
  }

  draw(ctx) {
    this.players.forEach((player) => player.draw(ctx));
  }
}

export default RemotePlayers;
