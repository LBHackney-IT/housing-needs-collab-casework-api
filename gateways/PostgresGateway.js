var pg = require('../lib/PostgresDb');

class PostgresGateway {
  async saveMessage(number, direction, message, username) {
    // Insert or update the user
    const userQuery = `INSERT INTO users (number)
      VALUES ($(number))
      ON CONFLICT (number) DO UPDATE SET number=EXCLUDED.number
      RETURNING id`;
    const user = await pg.one(userQuery, {
      number
    });

    // insert into messages table
    const insertQuery = `INSERT INTO messages (user_id, outgoing, message, username)
      VALUES ($(userId), $(outgoing), $(message), $(username))`;

    await pg.none(insertQuery, {
      userId: user.id,
      message,
      username,
      outgoing: direction === 'outgoing'
    });
  }
  async getMessages(number) {
    // insert into messages table
    const query = `SELECT users.number, messages.*
    FROM messages
    JOIN users on users.id = messages.user_id
    ORDER BY users.number DESC, time DESC`;

    const result = await pg.any(query, { number });
    return result;
  }
}

module.exports = PostgresGateway;
