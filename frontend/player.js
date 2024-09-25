import { FIELD_SIZE, BORDER_WIDTH } from "./constants.js";

class Player {
  constructor(color) {
    this.color = color;
    this.reset();
  }

  reset() {
    this.body = [
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
      { x: FIELD_SIZE / 2, y: FIELD_SIZE - 0.5 },
    ];
    this.direction = "up";
    this.deltaLength = 3;
    this.protected = true;
  }

  disableProtection() {
    this.protected = false;
  }

  draw(ctx) {
    const drawBody = (strokeStyle, lineWidth) => {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.beginPath();

      this.body.slice(0, -1).forEach((point, index) => {
        const nextPoint = this.body[index + 1];
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
      });

      ctx.stroke();
    };

    const drawNickname = () => {
      const head = this.body.at(-1);

      ctx.font = "1px 'Work Sans', system-ui, sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(this.nickname, head.x, head.y - 1);
    };

    ctx.globalAlpha = this.protected ? 0.5 : 1;
    drawBody("#000", 1);
    drawBody(this.color, 1 - 2 * BORDER_WIDTH);
    ctx.globalAlpha = 1;
    drawNickname();
  }
}

export default Player;
