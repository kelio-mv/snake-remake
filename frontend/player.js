import { BLOCK_SIZE } from "./constants.js";
import usernameInput from "./main.js";

const PLAYER_BLOCK_MARGIN = 1;
const PLAYER_BLOCK_SIZE = BLOCK_SIZE - PLAYER_BLOCK_MARGIN * 2;
const LOCAL_PLAYER_HEAD_COLOR = "#bfdbfe";
const LOCAL_PLAYER_BODY_COLOR = "#3b82f6";
const REMOTE_PLAYER_HEAD_COLOR = "#e5e7eb";
const REMOTE_PLAYER_BODY_COLOR = "#6b7280";

class Player {
  constructor(local) {
    this.local = local;
  }

  setState(state) {
    Object.assign(this, state);
  }

  draw(ctx) {
    if (this.protected) ctx.globalAlpha = 0.5;
    const [head, ...body] = this.body;
    ctx.fillStyle = this.local ? LOCAL_PLAYER_BODY_COLOR : REMOTE_PLAYER_BODY_COLOR;
    body.forEach(({ x, y }) =>
      ctx.fillRect(
        x + PLAYER_BLOCK_MARGIN,
        y + PLAYER_BLOCK_MARGIN,
        PLAYER_BLOCK_SIZE,
        PLAYER_BLOCK_SIZE
      )
    );
    ctx.fillStyle = this.local ? LOCAL_PLAYER_HEAD_COLOR : REMOTE_PLAYER_HEAD_COLOR;
    ctx.fillRect(
      head.x + PLAYER_BLOCK_MARGIN,
      head.y + PLAYER_BLOCK_MARGIN,
      PLAYER_BLOCK_SIZE,
      PLAYER_BLOCK_SIZE
    );
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
