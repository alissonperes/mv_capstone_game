async function callApi() {
  try {
    const response = await fetch(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/xMoa2Xows376PjOWmyai/scores',
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

async function saveScore(playerName, playerScore) {
  const sendData = {
    user: playerName,
    score: playerScore,
  };

  try {
    const response = await fetch(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/xMoa2Xows376PjOWmyai/scores',
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

      return data;
    }
    return response;
  } catch (e) {
    return e;
  }
}

export { callApi, saveScore };
