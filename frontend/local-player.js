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
const PLAYER_SPEED = 10;
const NET_FLOAT_PRECISION = 2;

class LocalPlayer extends Player {
  static roundFloat = (number) => parseFloat(number.toFixed(NET_FLOAT_PRECISION));
  nickname = null;
  touchStart = null;

  constructor() {
    super(LOCAL_PLAYER_COLOR);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
  }

  setNickname(nickname) {
    this.nickname = nickname;
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

  moveHead(deltaTime) {
    const head = this.body.at(-1);
    const deltaPos = deltaTime * PLAYER_SPEED;
    const [deltaX, deltaY] = {
      up: [0, -deltaPos],
      down: [0, deltaPos],
      left: [-deltaPos, 0],
      right: [deltaPos, 0],
    }[this.direction];

    head.x += deltaX;
    head.y += deltaY;
  }

  moveTail(deltaTime) {
    const [tail, target] = this.body;
    const targetDist = Math.abs(target.x - tail.x) || Math.abs(target.y - tail.y);
    const deltaPos = Math.min(deltaTime * PLAYER_SPEED, targetDist);
    const remainingTime = deltaTime - deltaPos / PLAYER_SPEED;
    const [deltaX, deltaY] = [
      deltaPos * Math.sign(target.x - tail.x),
      deltaPos * Math.sign(target.y - tail.y),
    ];

    tail.x += deltaX;
    tail.y += deltaY;

    if (tail.x === target.x && tail.y === target.y) {
      this.body.shift();
      this.moveTail(remainingTime);
    }
  }

  handleGrowth(deltaTime) {
    const deltaPos = deltaTime * PLAYER_SPEED;
    this.deltaLength -= deltaPos;

    if (this.deltaLength < 0) {
      const remainingTime = -this.deltaLength / PLAYER_SPEED;
      this.moveTail(remainingTime);
      this.deltaLength = 0;
    }
  }

  grow() {
    this.deltaLength += 1;
  }

  update(deltaTime) {
    this.moveHead(deltaTime);

    if (this.deltaLength > 0) {
      this.handleGrowth(deltaTime);
    } else {
      this.moveTail(deltaTime);
    }
  }

  getState() {
    const { roundFloat } = LocalPlayer;
    return this.body.map(({ x, y }) => [roundFloat(x), roundFloat(y)]);
  }
}

export default LocalPlayer;
