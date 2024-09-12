import Player from "./player.js";

const REMOTE_PLAYER_COLOR = "#fb923c";

class RemotePlayer extends Player {
  constructor(nickname, hasSpawnImmunity) {
    super(REMOTE_PLAYER_COLOR, hasSpawnImmunity);
    this.nickname = nickname;
  }

  setState(body, direction, deltaLength) {
    this.body = body.map(([x, y]) => ({ x, y }));
    this.direction = direction;
    this.deltaLength = deltaLength;
  }
}

class RemotePlayers {
  players = [];

  setPlayerState(nickname, state) {
    let player = this.players.find((player) => player.nickname === nickname);
    if (!player) {
      player = new RemotePlayer(nickname, false);
      this.players.push(player);
    }
    player.setState(...state);
  }

  respawnPlayer(nickname) {
    // what if player data isn't loaded yet?
    const player = this.players.find((player) => player.nickname === nickname);
    player.respawn();
  }

  removePlayerImmunity(nickname) {
    // what if player data isn't loaded yet?
    const player = this.players.find((player) => player.nickname === nickname);
    player.removeImmunity();
  }

  addPlayer(nickname) {
    const player = new RemotePlayer(nickname);
    this.players.push(player);
  }

  removePlayer(nickname) {
    this.players = this.players.filter((player) => player.nickname !== nickname);
  }

  draw(ctx) {
    this.players.forEach((player) => player.draw(ctx));
  }
}

export default RemotePlayers;
