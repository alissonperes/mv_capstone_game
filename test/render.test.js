import renderScores from '../src/render';

document.body.innerHTML += '<div id="scoreboard"></div>';

const scores = {
  result: [
    {
      user: 'Mr.Dev',
      score: 1440,
    },
  ],
};

it('renderScores should return a table', () => {
  renderScores(scores.result);
  const scoreboardTable = document.getElementById('scoreboard');
  expect(scoreboardTable.id).not.toBe(null);
});
