// Javascript function for letterbox scaling

function resizeCanvas() {
  const scaleX = innerWidth / canvas.width;
  const scaleY = innerHeight / canvas.height;
  const scale = Math.min(scaleX, scaleY);

  canvas.style.width = scale * canvas.width + "px";
  canvas.style.height = scale * canvas.height + "px";

  // You can use transform instead, but it slightly changes how pixels are rendered.
  // canvas.style.transform = `scale(${scale})`;
}
