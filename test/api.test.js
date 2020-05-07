import { getScores, saveScore } from '../src/api';

let fakeFetchCall = false;

it('getScores should return the scores from the Score API', () => {
  const fakeFetch = url => {
    expect(url).toBe(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/jzL3YG9B8dV7OaUNMdMt/scores',
    );
    fakeFetchCall = true;
    const result = {
      result: [
        {
          user: 'Mr.Dev',
          score: 1440,
        },
      ],
    };
    return result;
  };
  getScores(fakeFetch).then(result => {
    expect(result).toStrictEqual({ result: [{ score: 1440, user: 'Mr.Dev' }] });
  });
  expect(fakeFetchCall).toBe(true);
});

it('saveScore should save the new score', () => {
  let fakeFetchCall = false;
  const fakeFetch = url => {
    expect(url).toBe(
      'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/jzL3YG9B8dV7OaUNMdMt/scores',
    );
    fakeFetchCall = true;
    const result = { result: 'Leaderboard score created correctly.' };
    return result;
  };
  saveScore('Alisson', 10, fakeFetch).then(result => {
    expect(result).toStrictEqual({ result: 'Leaderboard score created correctly.' });
  });
  expect(fakeFetchCall).toBe(true);
});
