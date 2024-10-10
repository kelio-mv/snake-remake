import { localPlayer, respawnOverlay } from "./game.js";
import socket from "./socket.js";

const DIRECTION_BY_KEY = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  KeyW: "up",
  KeyS: "down",
  KeyA: "left",
  KeyD: "right",
};
const DIRECTION_KEYS = Object.keys(DIRECTION_BY_KEY);

class InputManager {
  handleKeyDown = this.handleKeyDown.bind(this);
  handleTouchStart = this.handleTouchStart.bind(this);
  handleTouchMove = this.handleTouchMove.bind(this);
  touchStart = null;

  addEventListeners() {
    addEventListener("keydown", this.handleKeyDown);
    addEventListener("touchstart", this.handleTouchStart);
    addEventListener("touchmove", this.handleTouchMove);
  }

  removeEventListeners() {
    removeEventListener("keydown", this.handleKeyDown);
    removeEventListener("touchstart", this.handleTouchStart);
    removeEventListener("touchmove", this.handleTouchMove);
  }

  handleKeyDown(e) {
    if (respawnOverlay.visible) {
      this.handleRespawn();
    }

    if (DIRECTION_KEYS.includes(e.code)) {
      const direction = DIRECTION_BY_KEY[e.code];
      localPlayer.setDirection(direction);
    }
  }

  handleTouchStart(e) {
    if (respawnOverlay.visible) {
      this.handleRespawn();
    }

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
      localPlayer.setDirection(deltaX < 0 ? "left" : "right");
    } else {
      localPlayer.setDirection(deltaY < 0 ? "up" : "down");
    }

    this.touchStart = null;
  }

  handleRespawn() {
    localPlayer.respawn();
    socket.emit("respawn");
    respawnOverlay.setVisible(false);
  }
}

export default InputManager;
