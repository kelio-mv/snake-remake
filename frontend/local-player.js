import Player from "./player.js";

const LOCAL_PLAYER_COLOR = "#38bdf8";
const DIRECTIONS_FROM_KEYS = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  KeyW: "up",
  KeyS: "down",
  KeyA: "left",
  KeyD: "right",
};
const DIRECTION_KEYS = Object.keys(DIRECTIONS_FROM_KEYS);
const OPPOSITE_DIRECTIONS = { up: "down", down: "up", left: "right", right: "left" };

class LocalPlayer extends Player {
  touchStart = null;

  constructor() {
    super(LOCAL_PLAYER_COLOR);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  setDirection(direction) {
    if ([this.direction, OPPOSITE_DIRECTIONS[this.direction]].includes(direction)) {
      return;
    }
    if (this.body.length > 2) {
      const [lastTurn, head] = this.body.slice(-2);
      const deltaPos = Math.abs(head.x - lastTurn.x) + Math.abs(head.y - lastTurn.y);

      if (deltaPos < 1) {
        return;
      }
    }

    this.direction = direction;
    this.body.push({ ...this.body.at(-1) });
  }

  handleKeyDown(e) {
    if (!DIRECTION_KEYS.includes(e.code)) {
      return;
    }

    const direction = DIRECTIONS_FROM_KEYS[e.code];
    this.setDirection(direction);
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    this.touchStart = { x: touch.clientX, y: touch.clientY };
  }

  handleTouchMove(e) {
    if (this.touchStart === null) {
      return;
    }

    const touch = e.touches[0];
    const [deltaX, deltaY] = [touch.clientX - this.touchStart.x, touch.clientY - this.touchStart.y];

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      this.setDirection(deltaX < 0 ? "left" : "right");
    } else {
      this.setDirection(deltaY < 0 ? "up" : "down");
    }

    this.touchStart = null;
  }

  getState() {
    const truncateNumber = (number) => Number(number.toFixed(2));

    return [
      this.body.map(({ x, y }) => [truncateNumber(x), truncateNumber(y)]),
      this.direction,
      truncateNumber(this.deltaLength),
    ];
  }
}

export default LocalPlayer;
