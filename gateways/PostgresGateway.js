var pg = require('../lib/PostgresDb');

class PostgresGateway {
  async saveMessage(number, direction, message, username) {
    // insert into messages table
    const insertQuery = `INSERT INTO messages (number, outgoing, message, username) 
      VALUES ($(number), $(outgoing), $(message), $(username))`;

    const result = await pg.none(insertQuery, {
      number, message, username, outgoing: direction === 'outgoing'
    });
  }
}

module.exports = PostgresGateway;
