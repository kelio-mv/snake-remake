import init from "./game.js";

const homePage = document.getElementById("home-page");
const usernameInput = document.getElementById("username-input");
const buttonPlay = document.getElementById("btn-play");
const buttonPlayIcon = document.getElementById("btn-play-icon");
const loader = document.getElementById("loader");
const socket = io("wss://snake-remake.glitch.me", {
  autoConnect: false,
  auth: (cb) => cb({ username: usernameInput.value }),
  transports: ["websocket"],
});

usernameInput.oninput = () => {
  usernameInput.value = usernameInput.value.replace(/[^a-zA-Z0-9_]/g, "");
  buttonPlay.disabled = usernameInput.value.length < 3;
};

usernameInput.onkeydown = (e) => {
  if (e.key === "Enter") buttonPlay.click();
};

buttonPlay.onclick = () => {
  socket.connect();
  buttonPlay.disabled = true;
  buttonPlayIcon.hidden = true;
  loader.hidden = false;
};

socket.on("connect", () => {
  homePage.hidden = true;
  init();
});

export default socket;
