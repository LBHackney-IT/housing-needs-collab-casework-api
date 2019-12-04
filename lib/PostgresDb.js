const pgp = require('pg-promise')({
  // global db error handler
  error(err, e) {
    console.log(`Postgres Error:
    Query: "${e && e.query ? e.query.replace('\n', '') : ''}"
    Error: "${err ? err.message : ''}"`);
  }
});

const PostgresDb = pgp({
  connectionString: process.env.DATABASE_URL
});

module.exports = PostgresDb;
