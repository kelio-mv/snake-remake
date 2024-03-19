import Player from "./player.js";

class RemotePlayers {
  players = [];

  setState({ username, ...state }) {
    let player = this.players.find((player) => player.username === username);

    if (player) {
      player.setState(state);
    } else {
      player = new RemotePlayer(username);
      player.setState(state);
      this.players.push(player);
    }
  }

  removePlayer = (username) => {
    const index = this.players.findIndex((player) => player.username === username);
    this.players.splice(index, 1);
  };

  draw(ctx) {
    this.players.forEach((player) => player.draw(ctx));
  }
}

class RemotePlayer extends Player {
  constructor(username) {
    super(false);
    this.username = username;
  }
}

export default RemotePlayers;
