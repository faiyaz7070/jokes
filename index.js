const fs = require('fs');
const process = require('process');
const request = require('request');

const URL = 'https://icanhazdadjoke.com/search';
const FILE = 'jokes.txt';

function getRandomJoke(jokes) {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  return jokes[randomIndex].joke;
}

function saveJokeToFile(joke) {
  fs.appendFileSync(FILE, `${joke}\n`, 'utf-8');
}

function displayJoke(joke) {
  console.log(`Here's a joke for you: ${joke}`);
}

function displayWittyMessage() {
  console.log("Sorry, the joke gods are on vacation. Try another search term!");
}

function displayLeaderboard() {
  const jokes = fs.readFileSync(FILE, 'utf-8').split('\n').filter(joke => joke.trim() !== '');
  if (jokes.length === 0) {
    console.log("The leaderboard is empty. No jokes to display!");
  } else {
    const mostPopularJoke = jokes.reduce((acc, joke) => {
      const count = (acc[joke] || 0) + 1;
      return { ...acc, [joke]: count };
    }, {});

    const sortedJokes = Object.keys(mostPopularJoke).sort((a, b) => mostPopularJoke[b] - mostPopularJoke[a]);
    const winnerJoke = sortedJokes[0];

    console.log(`And the most popular joke is: ${winnerJoke}`);
  }
}

function fetchJokes(searchTerm) {
  const options = {
    url: URL,
    headers: { 'Accept': 'application/json' },
    qs: { term: searchTerm },
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const jokesData = JSON.parse(body);
      if (jokesData.results.length > 0) {
        const selectedJoke = getRandomJoke(jokesData.results);
        displayJoke(selectedJoke);
        saveJokeToFile(selectedJoke);
      } else {
        displayWittyMessage();
      }
    } else {
      console.error('Error fetching jokes:', error);
    }
  });
}
function main() {
  const args = process.argv.slice(2);

  if (args.includes('leaderboard')) {
    displayLeaderboard();
  } else if (args.length > 0) {
    const searchTerm = args.join(' ');
    fetchJokes(searchTerm);
  } else {
    console.error('Please provide a search term.');
  }
}



main();


