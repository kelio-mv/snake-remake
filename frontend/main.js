import { FIELD_SIZE, BG_LIGHT_COLOR, BG_DARK_COLOR } from "./constants.js";
import initGame from "./game.js";
import socket from "./socket.js";

const homePage = document.querySelector(".home-page");
const homeForm = document.querySelector(".home-form");
const homeNicknameInput = document.querySelector(".home-nickname-input");
const gamePage = document.querySelector(".game-page");

homePage.style.setProperty("--bg-light-color", BG_LIGHT_COLOR);
homePage.style.setProperty("--bg-dark-color", BG_DARK_COLOR);
homePage.style.setProperty("--field-size", FIELD_SIZE);

homeNicknameInput.addEventListener("input", () => {
  homeNicknameInput.value = homeNicknameInput.value.replace(/[^a-zA-Z0-9_]/g, "");
});

homeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.connect();
});

socket.on("connect", () => {
  homePage.hidden = true;
  gamePage.hidden = false;
  initGame();
});

export default homeNicknameInput;
