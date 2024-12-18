import { FIELD_SIZE } from "./constants.js";

class RespawnOverlay {
  visible = false;

  setVisible(value) {
    this.visible = value;
  }

  draw(ctx) {
    if (!this.visible) {
      return;
    }

    ctx.fillStyle = "#000";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, FIELD_SIZE, FIELD_SIZE);
    ctx.globalAlpha = 1;

    ctx.font = "1.5px 'Work Sans', system-ui, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      ("ontouchstart" in window ? "Toque na tela " : "Pressione uma tecla ") + "para renascer",
      FIELD_SIZE / 2,
      FIELD_SIZE / 2
    );
  }
}

const respawnOverlay = new RespawnOverlay();

export default respawnOverlay;
