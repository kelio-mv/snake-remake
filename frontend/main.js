import { FIELD_SIZE, BG_LIGHT_COLOR, BG_DARK_COLOR } from "./constants.js";
import initGame from "./game.js";
import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const homePage = document.querySelector(".home-page");
const homeForm = document.querySelector(".home-form");
const gamePage = document.querySelector(".game-page");

homePage.style.setProperty("--bg-light-color", BG_LIGHT_COLOR);
homePage.style.setProperty("--bg-dark-color", BG_DARK_COLOR);
homePage.style.setProperty("--field-size", FIELD_SIZE);

homeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  homePage.hidden = true;
  gamePage.hidden = false;
  initGame();
});
