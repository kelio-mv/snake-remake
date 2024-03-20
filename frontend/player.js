import { BLOCK_SIZE } from "./constants.js";
import usernameInput from "./main.js";

const PLAYER_BLOCK_MARGIN = 1;
const PLAYER_BLOCK_SIZE = BLOCK_SIZE - PLAYER_BLOCK_MARGIN * 2;
const LOCAL_PLAYER_COLOR = "#60a5fa";
const REMOTE_PLAYER_COLOR = "#9ca3af";

class Player {
  constructor(local) {
    this.local = local;
  }

  setState(state) {
    Object.assign(this, state);
  }

  draw(ctx) {
    if (this.protected) ctx.globalAlpha = 0.5;
    ctx.fillStyle = this.local ? LOCAL_PLAYER_COLOR : REMOTE_PLAYER_COLOR;
    this.body.forEach(({ x, y }) =>
      ctx.fillRect(
        x + PLAYER_BLOCK_MARGIN,
        y + PLAYER_BLOCK_MARGIN,
        PLAYER_BLOCK_SIZE,
        PLAYER_BLOCK_SIZE
      )
    );

    const head = this.body[0];
    ctx.font = "16px 'Silkscreen', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "-1px";
    ctx.fillText(
      this.local ? usernameInput.value : this.username,
      head.x + BLOCK_SIZE / 2,
      head.y - BLOCK_SIZE
    );
    ctx.globalAlpha = 1;
  }
}

export default Player;
