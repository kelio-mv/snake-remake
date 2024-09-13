import Player from "./player.js";

const REMOTE_PLAYER_COLOR = "#fb923c";

class RemotePlayer extends Player {
  constructor(nickname, state) {
    super(REMOTE_PLAYER_COLOR);
    this.nickname = nickname;

    if (state) {
      this.setState(...state);
      this.disableProtection();
      // fix me: player might have protection tho
    }
  }

  setState(body, direction, deltaLength) {
    this.body = body.map(([x, y]) => ({ x, y }));
    this.direction = direction;
    this.deltaLength = deltaLength;
  }
}

class RemotePlayers {
  players = [];

  addPlayer(nickname, state) {
    this.players.push(new RemotePlayer(nickname, state));
  }

  removePlayer(nickname) {
    this.players = this.players.filter((player) => player.nickname !== nickname);
  }

  getPlayer(nickname) {
    return this.players.find((player) => player.nickname === nickname);
  }

  setPlayerState(nickname, state) {
    this.getPlayer(nickname).setState(...state);
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
