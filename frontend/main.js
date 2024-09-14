import { FIELD_SIZE, BG_LIGHT_COLOR, BG_DARK_COLOR } from "./constants.js";
import { startGame, stopGame } from "./game.js";
import socket from "./socket.js";

const homePage = document.querySelector(".home-page");
const homeForm = document.querySelector(".home-form");
const homeNicknameInput = document.querySelector(".home-nickname-input");
const homeJoinButton = document.querySelector(".home-join-button");
const homeJoinLabel = document.querySelector(".home-join-label");
const homeJoinLoader = document.querySelector(".home-join-loader");
const gamePage = document.querySelector(".game-page");

homePage.style.setProperty("--bg-light-color", BG_LIGHT_COLOR);
homePage.style.setProperty("--bg-dark-color", BG_DARK_COLOR);
homePage.style.setProperty("--field-size", FIELD_SIZE);

homeNicknameInput.value = localStorage.getItem("nickname");

homeNicknameInput.addEventListener("input", () => {
  homeNicknameInput.value = homeNicknameInput.value.replace(/[^a-zA-Z0-9_]/g, "");
});

homeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  homeNicknameInput.disabled = true;
  homeJoinButton.disabled = true;
  homeJoinLabel.hidden = true;
  homeJoinLoader.hidden = false;
  socket.connect();
});

socket.on("connect", () => {
  localStorage.setItem("nickname", homeNicknameInput.value);
  homePage.hidden = true;
  gamePage.hidden = false;
  startGame(homeNicknameInput.value);
});

socket.on("connect_error", (err) => {
  if (err.message === "login error") {
    alert("Este nome de usuário já está em uso.");
    homeNicknameInput.disabled = false;
    homeJoinButton.disabled = false;
    homeJoinLabel.hidden = false;
    homeJoinLoader.hidden = true;
  }
});

socket.on("disconnect", () => {
  stopGame();
  homePage.hidden = false;
  gamePage.hidden = true;
});

export default homeNicknameInput;
