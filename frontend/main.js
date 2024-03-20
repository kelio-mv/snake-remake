import socket from "./socket.js";
import { handleConnect, handleDisconnect } from "./game.js";

const homePage = document.getElementById("home-page");
const usernameInput = document.getElementById("username-input");
const buttonPlay = document.getElementById("btn-play");
const alreadyUsed = document.getElementById("already-used");
const buttonSound = new Audio("assets/button.ogg");

usernameInput.oninput = () => {
  usernameInput.value = usernameInput.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
  buttonPlay.disabled = usernameInput.value.length < 3;
};

usernameInput.onkeydown = (e) => {
  if (e.key === "Enter") buttonPlay.click();
};

buttonPlay.onclick = () => {
  socket.connect();
  usernameInput.disabled = true;
  buttonPlay.disabled = true;
  buttonSound.play();
};

socket.on("connect", () => {
  homePage.hidden = true;
  alreadyUsed.hidden = true;
  handleConnect();
});

socket.on("connect_error", (err) => {
  if (err.message === "auth error") {
    usernameInput.disabled = false;
    buttonPlay.disabled = false;
    alreadyUsed.hidden = false;
  }
});

socket.on("disconnect", () => {
  handleDisconnect();
  homePage.hidden = false;
});

export default usernameInput;
