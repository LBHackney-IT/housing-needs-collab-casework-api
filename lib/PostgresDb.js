const pgp = require('pg-promise')({
  // global db error handler
  error(err, e) {
    console.log(`Postgres Error:
    Query: "${e && e.query ? e.query.replace('\n', '') : ''}"
    Error: "${err ? err.message : ''}"`);
  }
});

const PostgresDb = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

module.exports = PostgresDb;
