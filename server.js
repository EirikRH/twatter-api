
const express = require('express');
const cors = require('cors');
const app = express();

const { getTweets } = require('./services/database');

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) =>{
  res.send('Hello from Twatter API!')
});

app.get('/tweets', async (req, res) =>{
  const tweets = await getTweets();
  res.json(tweets);
});

app.listen(PORT, () =>{
  console.log(`Twitter API listening to ${PORT}`)
})