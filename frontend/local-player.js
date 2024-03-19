import Player from "./player.js";
import {
  BLOCK_SIZE,
  MAP_BOUNDARY,
  PLAYER_INITIAL_LENGTH,
  PLAYER_INITIAL_POSITION,
  PLAYER_INITIAL_DIRECTION,
} from "./constants.js";

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

class LocalPlayer extends Player {
  body = Array.from({ length: PLAYER_INITIAL_LENGTH }, () => PLAYER_INITIAL_POSITION);
  direction = PLAYER_INITIAL_DIRECTION;
  canChangeDirection = true;
  protected = false;
  touchStart = { x: null, y: null };

  constructor(socket) {
    super(true);
    this.socket = socket;
    addEventListener("keydown", this.handleKeyDown);
    addEventListener("touchstart", this.handleTouchStart);
    addEventListener("touchmove", this.handleTouchMove);
  }

  update() {
    this.body.unshift({ ...this.body[0] });
    this.body.pop();

    const head = this.body[0];
    const moveHead = {
      up: () => (head.y -= BLOCK_SIZE),
      down: () => (head.y += BLOCK_SIZE),
      left: () => (head.x -= BLOCK_SIZE),
      right: () => (head.x += BLOCK_SIZE),
    }[this.direction];
    moveHead();

    if (head.x > MAP_BOUNDARY) head.x = 0;
    else if (head.x < 0) head.x = MAP_BOUNDARY;
    if (head.y > MAP_BOUNDARY) head.y = 0;
    else if (head.y < 0) head.y = MAP_BOUNDARY;

    this.sendState();
    this.canChangeDirection = true;
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

  draw(ctx) {
    super.draw(ctx);
  }
}

export default LocalPlayer;
