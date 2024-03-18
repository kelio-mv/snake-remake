const BG_COLOR = "#030712";

class Background {
  draw(ctx, canvas) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

export default Background;
