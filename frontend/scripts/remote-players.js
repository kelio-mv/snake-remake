import Player from "./player.js";

const REMOTE_PLAYER_COLOR = "#fb923c";

class RemotePlayer extends Player {
  constructor(nickname, dead, state, unprotected) {
    super(REMOTE_PLAYER_COLOR);
    this.nickname = nickname;

    if (dead) {
      this.kill();
      return;
    }
    if (state) {
      this.setState(state);

      if (unprotected) {
        this.unprotect();
      }
    }
  }

  setState(body) {
    this.body = body.map(([x, y]) => ({ x, y }));
  }
}

class RemotePlayers {
  players = [];

  get(nickname) {
    return this.players.find((player) => player.nickname === nickname);
  }

  setInitialState(players) {
    this.players = players.map(
      ([nickname, state, unprotected]) => new RemotePlayer(nickname, !state, state, unprotected)
    );
  }

  setPlayerState(nickname, state) {
    this.get(nickname).setState(state);
  }

  add(nickname) {
    this.players.push(new RemotePlayer(nickname));
  }

  remove(nickname) {
    this.players = this.players.filter((player) => player.nickname !== nickname);
  }

  unprotect(nickname) {
    this.get(nickname).unprotect();
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

const remotePlayers = new RemotePlayers();

export default remotePlayers;
