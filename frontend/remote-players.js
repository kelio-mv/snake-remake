import Player from "./player.js";

const REMOTE_PLAYER_COLOR = "#fb923c";

class RemotePlayer extends Player {
  constructor(nickname, state, unprotected) {
    super(REMOTE_PLAYER_COLOR);
    this.nickname = nickname;

    if (state) {
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

  addPlayer(nickname, state, unprotected) {
    this.players.push(new RemotePlayer(nickname, state, unprotected));
  }

  removePlayer(nickname) {
    this.players = this.players.filter((player) => player.nickname !== nickname);
  }

  getPlayer(nickname) {
    return this.players.find((player) => player.nickname === nickname);
  }

  setPlayerState(nickname, state) {
    this.getPlayer(nickname).setState(state);
  }

  resetPlayer(nickname) {
    this.getPlayer(nickname).reset();
  }

  disablePlayerProtection(nickname) {
    this.getPlayer(nickname).disableProtection();
  }

  draw(ctx) {
    this.players.forEach((player) => player.draw(ctx));
  }
}

export default RemotePlayers;
