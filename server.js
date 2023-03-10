
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

const { getTweets, getTweetsByUsername, postTweet, getUserByUsername } = require('./services/database');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const APP_SECRET = 'my-secret-key-1234'
 
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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try{
    
  const user = await getUserByUsername(username);

  if(!user){
    res.status(401).send({ error: 'Unknown user - not found..' });
    return;
  }
  if(password !== user.password){
    res.status(401).send({ error: 'Wrong password' });
    return;
  }

  const token = jwt.sign({
    id: user.id,
    username: user.username,
    name: user.name,
  }, Buffer.from(APP_SECRET, 'base64'));

  res.json({ token });
  } catch (error) {
    res.status(500).send({error: error.message})
  }
});

app.get('/session', async (req, res) => {
  const token = req.headers['x-token'];

  try{
    const payload = jwt.verify(token, Buffer.from(APP_SECRET, 'base64'));
    res.json({ message: `You are logged in as ${payload.username}`});
  } catch(error){
    res.status(401).send({ error: 'Invalid token' });
  }
})

app.listen(PORT, () =>{
  console.log(`Twitter API listening to port ${PORT}`);
});