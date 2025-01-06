import { FIELD_SIZE, BG_LIGHT_COLOR, BG_DARK_COLOR } from "./constants.js";
import { startGame, stopGame } from "./game.js";
import socket from "./socket.js";

const homePage = document.querySelector(".home-page");
const homeForm = document.querySelector(".home-form");
const homeNicknameInput = document.querySelector(".home-nickname-input");
const homeJoinButton = document.querySelector(".home-join-button");
const homeJoinLabel = document.querySelector(".home-join-label");
const homeJoinLoader = document.querySelector(".home-join-loader");
const homeErrorAlert = document.querySelector(".home-error-alert");
const homeErrorMessage = document.querySelector(".home-error-message");
const gamePage = document.querySelector(".game-page");
const sounds = {
  buttonClick: new Audio("sounds/button-click.ogg"),
  connectionError: new Audio("sounds/connection-error.ogg"),
};

function resetForm() {
  homeNicknameInput.disabled = false;
  homeJoinButton.disabled = false;
  homeJoinLabel.hidden = false;
  homeJoinLoader.hidden = true;
}

homePage.style.setProperty("--bg-light-color", BG_LIGHT_COLOR);
homePage.style.setProperty("--bg-dark-color", BG_DARK_COLOR);
homePage.style.setProperty("--field-size", FIELD_SIZE);

homeNicknameInput.value = localStorage.getItem("nickname");

homeNicknameInput.addEventListener("input", () => {
  homeNicknameInput.value = homeNicknameInput.value.replace(/[^a-zA-Z0-9_]/g, "");
  homeNicknameInput.setCustomValidity("");
});

homeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  homeNicknameInput.disabled = true;
  homeJoinButton.disabled = true;
  homeJoinLabel.hidden = true;
  homeJoinLoader.hidden = false;
  socket.connect();
  sounds.buttonClick.play();
});

socket.on("connect", () => {
  localStorage.setItem("nickname", homeNicknameInput.value);
  homePage.hidden = true;
  gamePage.hidden = false;
  startGame(homeNicknameInput.value);
});

socket.on("connect_error", (err) => {
  resetForm();
  sounds.connectionError.play();

  if (err.message === "login error") {
    homeNicknameInput.setCustomValidity("Este nome de usuário já está em uso.");
    homeNicknameInput.reportValidity();
  } else {
    homeErrorMessage.textContent = "Não foi possível conectar-se ao servidor.";
    homeErrorAlert.hidden = false;
  }
});

socket.on("disconnect", () => {
  stopGame();
  resetForm();
  gamePage.hidden = true;
  homePage.hidden = false;
  homeErrorMessage.textContent = "A conexão ao servidor foi perdida.";
  homeErrorAlert.hidden = false;
  sounds.connectionError.play();
});

export default homeNicknameInput;
