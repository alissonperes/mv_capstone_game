const sortScores = scores => {
  scores.sort((a, b) => b.score - a.score);
};

export default function renderScores(scores) {
  const scoreBoardDiv = document.getElementById('scoreboard');
  sortScores(scores);

  const filteredScores = scores.filter((v, i, a) => a.findIndex(t => t.user === v.user) === i);

  const newTable = document.createElement('table');
  newTable.border = '7';
  const mainTr = document.createElement('tr');
  const nameTh = document.createElement('th');
  const scoreTh = document.createElement('th');
  nameTh.innerText = 'Player';
  scoreTh.innerText = 'Score';
  mainTr.appendChild(nameTh);
  mainTr.appendChild(scoreTh);
  newTable.appendChild(mainTr);
  filteredScores.forEach(x => {
    const newTr = document.createElement('tr');
    const nameTd = document.createElement('td');
    nameTd.innerText = x.user;
    newTr.appendChild(nameTd);
    const scoreTd = document.createElement('td');
    scoreTd.innerText = x.score;
    newTr.appendChild(scoreTd);
    newTable.appendChild(newTr);
  });

  scoreBoardDiv.innerHTML = newTable.outerHTML;
  return scoreBoardDiv;
}
