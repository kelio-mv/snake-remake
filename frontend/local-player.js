import {
  BLOCK_SIZE,
  PLAYER_INITIAL_LENGTH,
  PLAYER_INITIAL_POSITION,
  PLAYER_INITIAL_DIRECTION,
} from "./constants.js";

const PLAYER_HEAD_COLOR = "#e5e7eb";
const PLAYER_BODY_COLOR = "#6b7280";
const PLAYER_BLOCK_MARGIN = 1;
const PLAYER_BLOCK_SIZE = BLOCK_SIZE - PLAYER_BLOCK_MARGIN * 2;
const DIRECTIONS = {
  arrowup: "up",
  arrowdown: "down",
  arrowleft: "left",
  arrowright: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};
const OPPOSITE_DIRECTIONS = { up: "down", down: "up", left: "right", right: "left" };
const MOVEMENT_KEYS = Object.keys(DIRECTIONS);

class LocalPlayer {
  body = Array.from({ length: PLAYER_INITIAL_LENGTH }, () => PLAYER_INITIAL_POSITION);
  direction = PLAYER_INITIAL_DIRECTION;
  canChangeDirection = true;
  protected = false;
  touchStart = { x: null, y: null };

  constructor(socket) {
    this.socket = socket;
    addEventListener("keydown", this.handleKeyDown);
    addEventListener("touchstart", this.handleTouchStart);
    addEventListener("touchmove", this.handleTouchMove);
  }

  update() {
    this.body.unshift({ ...this.body[0] });
    this.body.pop();

    const head = this.body[0];
    const move = {
      up: () => (head.y -= BLOCK_SIZE),
      down: () => (head.y += BLOCK_SIZE),
      left: () => (head.x -= BLOCK_SIZE),
      right: () => (head.x += BLOCK_SIZE),
    }[this.direction];

    move();
    this.sendState();
    this.canChangeDirection = true;
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

  handleKeyDown = ({ key }) => {
    key = key.toLowerCase();
    if (MOVEMENT_KEYS.includes(key) && this.canChangeDirection) {
      const direction = DIRECTIONS[key];
      this.setDirection(direction);
    }
  };

  handleTouchStart = (e) => {
    const touch = e.touches[0];
    this.touchStart = { x: touch.clientX, y: touch.clientY };
  };

  handleTouchMove = (e) => {
    if (this.canChangeDirection) {
      const touch = e.touches[0];
      const delta = { x: touch.clientX - this.touchStart.x, y: touch.clientY - this.touchStart.y };

      if (Math.abs(delta.x) > Math.abs(delta.y)) {
        if (delta.x > 0) {
          this.setDirection("right");
        } else {
          this.setDirection("left");
        }
      } else {
        if (delta.y > 0) {
          this.setDirection("down");
        } else {
          this.setDirection("up");
        }
      }
    }
  };

  setDirection(direction) {
    const oppositeDirection = OPPOSITE_DIRECTIONS[this.direction];

    if (![this.direction, oppositeDirection].includes(direction)) {
      this.direction = direction;
      this.canChangeDirection = false;
    }
  }

  increaseLength() {
    const lastElement = this.body[this.body.length - 1];
    this.body.push({ ...lastElement });
  }

  respawn = () => {
    this.body = Array.from({ length: PLAYER_INITIAL_LENGTH }, () => PLAYER_INITIAL_POSITION);
    this.direction = PLAYER_INITIAL_DIRECTION;
    this.protected = true;
    this.sendState({ protected: true });
    setTimeout(() => {
      this.protected = false;
      this.socket.emit("update_player", { protected: false });
    }, 1000);
  };

  sendState(state) {
    this.socket.emit("update_player", { body: this.body, direction: this.direction, ...state });
  }

  setState(state) {
    Object.assign(this, state);
  }
}

export default LocalPlayer;
