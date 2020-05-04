import Game from "./gameStart.js";
import { callApi } from "./api";
import { renderScores } from "./render";

const get = item => localStorage.getItem(item);
const set = (item, value) => {
  localStorage.setItem(item, value);
  return get();
};

let userInputDiv = document.getElementById("user-input");

callApi().then(result => renderScores(result.result, userInputDiv));

const startGame = function() {
  window.game = new Game();
  userInputDiv.style.display = "none";
};

const formSubmit = function(form) {
  if (!form.checkValidity()) {
    form.reportValidity();
  } else {
    set("Player", form[0].value);
    set("Score", 0);
    form.style.display = "none";
    startGame();
  }
};

let player = get("Player") || null;

const loadForm = function() {
  userInputDiv.innerHTML = `<form id="user-name">
    <label for="name">Name: </label>
    <input type="text" name="name" placeholder="Player Name" required />
    <button type="button" name="Start" id="btn-start-game">Start Game</button>
  </form>`;

  let form = document.getElementById("user-name");

  form.addEventListener("submit", function() {
    formSubmit(form);
  });

  let btnStart = document.getElementById("btn-start-game");
  btnStart.addEventListener("click", function() {
    formSubmit(form);
  });
};

if (!player) {
  loadForm();
} else {
  userInputDiv.innerHTML = `<h4>${get("Player")}</h4>
  <button id="btn-change-player" type="button" name="changePlayer">Change Player</button>
  <button id="btn-start-game" type="button" name="startGame">Start game</button>`;

  let changePlayerBtn = document.getElementById("btn-change-player");
  let startGameBtn = document.getElementById("btn-start-game");

  startGameBtn.addEventListener("click", startGame);
  changePlayerBtn.addEventListener("click", loadForm);
}
