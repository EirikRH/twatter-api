const { Pool } = require('pg');

const POSTGRES_URL = process.env.POSTGRES_URL || 'postgresql://postgres:1234@localhost:5432/TWATTER'

const database = new Pool({
  connectionString: POSTGRES_URL,
});

async function getTweets(){
  const result = await database.query(`
    SELECT
      tweets.id,
      tweets.message,
      tweets.created_at,
      users.name,
      users.username
    FROM
      tweets
    INNER JOIN users ON 
      tweets.user_id = users.id
    ORDER BY created_at DESC;
  `);
  return result.rows;
}


async function getTweetsByUsername(username){
  const result = await database.query(`
  SELECT
    tweets.id,
    tweets.message,
    tweets.created_at,
    users.name,
    users.username
  FROM
    tweets
  INNER JOIN users ON 
    tweets.user_id = users.id
  WHERE
  users.username = $1
  ORDER BY created_at DESC;
  `, [username]);

  console.log(result.rows);
  return result.rows;
}

async function postTweet(username, message){
  const userId = await database.query(`
    SELECT 
      id
    FROM
      users
    WHERE
      username = $1;
  `, [username]);
  const tweet = await database.query(`
    INSERT INTO tweets
      (user_id, message)
    VALUES
      ($1, $2)
    RETURNING id, message;
  `, [userId.rows[0].id, message]);

  return tweet.rows[0];
}

async function getUserByUsername(username){
  const result = database.query(`
    SELECT 
      *
    FROM
      users
    WHERE
     username = $1
  `, [username]);

  return result.rows[0];
}

module.exports = {
  getTweets,
  getTweetsByUsername,
  postTweet,
  getUserByUsername,
}