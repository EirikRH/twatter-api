const { Pool } = require('pg');

const database = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TWATTER',
  password: '1234',
  port: 5432,
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
  console.log(result);
  return result;
}

module.exports = {
  getTweets,
}