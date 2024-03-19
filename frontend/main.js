import socket from "./socket.js";
import { handleConnect, handleDisconnect } from "./game.js";

const homePage = document.getElementById("home-page");
const usernameInput = document.getElementById("username-input");
const buttonPlay = document.getElementById("btn-play");

usernameInput.oninput = () => {
  usernameInput.value = usernameInput.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
  buttonPlay.disabled = usernameInput.value.length < 3;
};

usernameInput.onkeydown = (e) => {
  if (e.key === "Enter") buttonPlay.click();
};

buttonPlay.onclick = () => {
  socket.connect();
  buttonPlay.disabled = true;
};

socket.on("connect", () => {
  homePage.hidden = true;
  handleConnect();
});

socket.on("disconnect", () => {
  handleDisconnect();
  homePage.hidden = false;
});

export default usernameInput;
