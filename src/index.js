import Game from './gameStart';
import { callApi } from './api';
import renderScores from './render';

const get = item => localStorage.getItem(item);
const set = (item, value) => {
  localStorage.setItem(item, value);
  return get();
};

const userInputDiv = document.getElementById('user-input');

callApi().then(result => renderScores(result.result, userInputDiv));

const startGame = () => {
  window.game = new Game();
  userInputDiv.style.display = 'none';
};

const formSubmit = form => {
  if (!form.checkValidity()) {
    form.reportValidity();
  } else {
    set('Player', form[0].value);
    set('Score', 0);
    form.style.display = 'none';
    startGame();
  }
};

const player = get('Player') || null;

const loadForm = () => {
  userInputDiv.innerHTML = `<form id="user-name">
    <label for="name">Name: </label>
    <input type="text" name="name" placeholder="Player Name" required />
    <button type="button" name="Start" id="btn-start-game">Start Game</button>
  </form>`;

  const form = document.getElementById('user-name');

  form.addEventListener('submit', () => {
    formSubmit(form);
  });

  const btnStart = document.getElementById('btn-start-game');
  btnStart.addEventListener('click', () => {
    formSubmit(form);
  });
};

if (!player) {
  loadForm();
} else {
  userInputDiv.innerHTML = `<h4>${get('Player')}</h4>
  <button id="btn-change-player" type="button" name="changePlayer">Change Player</button>
  <button id="btn-start-game" type="button" name="startGame">Start game</button>`;

  const changePlayerBtn = document.getElementById('btn-change-player');
  const startGameBtn = document.getElementById('btn-start-game');

  startGameBtn.addEventListener('click', startGame);
  changePlayerBtn.addEventListener('click', loadForm);
}
