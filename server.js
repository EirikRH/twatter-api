
const express = require('express');
const cors = require('cors');
const app = express();

const { getTweets, getTweetsByUsername, postTweet } = require('./services/database');

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) =>{
  res.send('Hello from Twatter API!');
});

app.get('/tweets', async (req, res) =>{
  const tweets = await getTweets();
  res.json(tweets);
});

app.get('/tweets/:username', async (req, res) =>{
  const { username } = req.params;
  const tweets = await getTweetsByUsername(username);
  res.json(tweets);
});

app.post('/tweets/:username', async (req, res) => {
  const { username } = req.params;
  const { message } = req.body;
  const newTweet = await postTweet(username, message);

  res.send(newTweet);
});

app.listen(PORT, () =>{
  console.log(`Twitter API listening to port ${PORT}`);
});