const JOY_RADIUS = 4.5;

class Joystick {
  visible = false;
  basePos = null;
  handlePos = null;
  direction = null;

  setPosition(x, y) {
    this.basePos = { x, y };
    this.setHandlePosition(x, y);
    this.visible = true;
  }

  setHandlePosition(x, y) {
    const [offsetX, offsetY] = [x - this.basePos.x, y - this.basePos.y];
    const distance = Math.hypot(offsetX, offsetY);

    if (distance > JOY_RADIUS) {
      const angle = Math.atan2(offsetY, offsetX);
      x = this.basePos.x + JOY_RADIUS * Math.cos(angle);
      y = this.basePos.y + JOY_RADIUS * Math.sin(angle);
    }

    this.handlePos = { x, y };
    this.updateDirection(offsetX, offsetY);
  }

  updateDirection(offsetX, offsetY) {
    if (Math.abs(offsetX) > Math.abs(offsetY)) {
      this.direction = offsetX < 0 ? "left" : "right";
    } else if (Math.abs(offsetY) > Math.abs(offsetX)) {
      this.direction = offsetY < 0 ? "up" : "down";
    }
  }

  hide() {
    this.visible = false;
  }

  draw(ctx) {
    if (!this.visible) {
      return;
    }
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(this.basePos.x, this.basePos.y, JOY_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.beginPath();
    ctx.arc(this.handlePos.x, this.handlePos.y, JOY_RADIUS / 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }
}

export default Joystick;
