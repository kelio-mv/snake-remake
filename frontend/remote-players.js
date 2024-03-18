import { BLOCK_SIZE } from "./constants.js";

const PLAYER_HEAD_COLOR = "#e5e7eb";
const PLAYER_BODY_COLOR = "#6b7280";
const PLAYER_BLOCK_MARGIN = 1;
const PLAYER_BLOCK_SIZE = BLOCK_SIZE - PLAYER_BLOCK_MARGIN * 2;

class RemotePlayers {
  players = [];

  setState = ({ username, ...state }) => {
    let player = this.players.find((player) => player.username === username);

    if (player) {
      player.setState(state);
    } else {
      player = new RemotePlayer(username);
      player.setState(state);
      this.players.push(player);
    }
  };

  removePlayer = (username) => {
    const index = this.players.findIndex((player) => player.username === username);
    this.players.splice(index, 1);
  };

  draw(ctx) {
    this.players.forEach((player) => player.draw(ctx));
  }
}

class RemotePlayer {
  constructor(username) {
    this.username = username;
  }

  setState(state) {
    Object.assign(this, state);
  }

  draw(ctx) {
    if (this.protected) ctx.globalAlpha = 0.5;
    const [head, ...body] = this.body;
    ctx.fillStyle = PLAYER_BODY_COLOR;
    body.forEach(({ x, y }) =>
      ctx.fillRect(
        x + PLAYER_BLOCK_MARGIN,
        y + PLAYER_BLOCK_MARGIN,
        PLAYER_BLOCK_SIZE,
        PLAYER_BLOCK_SIZE
      )
    );
    ctx.fillStyle = PLAYER_HEAD_COLOR;
    ctx.fillRect(
      head.x + PLAYER_BLOCK_MARGIN,
      head.y + PLAYER_BLOCK_MARGIN,
      PLAYER_BLOCK_SIZE,
      PLAYER_BLOCK_SIZE
    );
    ctx.globalAlpha = 1;
  }
}

export default RemotePlayers;
