import Player from "./player.js";

const REMOTE_PLAYER_COLOR = "#fb923c";

class RemotePlayer extends Player {
  constructor(nickname) {
    super(REMOTE_PLAYER_COLOR);
    this.nickname = nickname;
  }

  setState(body, direction, deltaLength) {
    this.body = body;
    this.direction = direction;
    this.deltaLength = deltaLength;
  }
}

class RemotePlayers {
  players = [];

  setPlayerState(nickname, state) {
    let player = this.players.find((player) => player.nickname === nickname);
    if (!player) {
      player = new RemotePlayer(nickname);
      this.players.push(player);
    }
    player.setState(...state);
  }

  removePlayer(nickname) {
    this.players = this.players.filter((player) => player.nickname !== nickname);
  }

  draw(ctx) {
    this.players.forEach((player) => player.draw(ctx));
  }
}

export default RemotePlayers;
