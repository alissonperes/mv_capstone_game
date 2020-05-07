import renderScores from './render';

async function getScores(fetch) {
  try {
    const response = await fetch(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/jzL3YG9B8dV7OaUNMdMt/scores',
      {
        method: 'GET',
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return response;
  } catch (e) {
    return e;
  }
}

async function saveScore(playerName, playerScore, fetch) {
  const sendData = {
    user: playerName,
    score: playerScore,
  };

  try {
    const response = await fetch(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/jzL3YG9B8dV7OaUNMdMt/scores',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendData),
      },
    );
    if (response.ok) {
      const data = await response.json();
      getScores(fetch).then(scores => renderScores(scores.result));
      console.log(scores);
      return data;
    }
    return response;
  } catch (e) {
    return e;
  }
}

export { getScores, saveScore };
