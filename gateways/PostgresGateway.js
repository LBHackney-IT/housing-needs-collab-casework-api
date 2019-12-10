var pg = require('../lib/PostgresDb');

const processContact = function(contact) {
  let user = {
    id: contact.id,
    name: contact.name,
    number: contact.number,
    jigsawId: contact.jigsaw_id,
    lastMessage: null
  };
  if (contact.time) {
    user.lastMessage = {
      direction: contact.outgoing ? 'outgoing' : 'incoming',
      message: contact.message,
      time: contact.time
    };
  }
  return user;
};

class PostgresGateway {
  async saveMessage(userId, direction, message, username) {
    // insert into messages table
    const insertQuery = `INSERT INTO messages (user_id, outgoing, message, username)
      VALUES ($(userId), $(outgoing), $(message), $(username))`;

    await pg.none(insertQuery, {
      userId: userId,
      message,
      username,
      outgoing: direction === 'outgoing'
    });
  }

  async getMessages(user_id) {
    // insert into messages table
    const query = `SELECT *
    FROM messages
    WHERE user_id = $(user_id)
    ORDER BY time ASC`;

    const result = await pg.any(query, { user_id });
    return result;
  }

  async getContact(id) {
    const query = `WITH latest_messages AS (
      select *, row_number() over(partition by user_id order by time desc) as rn from messages WHERE user_id = $(id)
    )
    SELECT users.*, latest_messages.message, latest_messages.time, latest_messages.outgoing
    FROM users
    LEFT JOIN latest_messages ON latest_messages.user_id = users.id and latest_messages.rn = 1
    WHERE users.id = $(id);`;

    const result = await pg.one(query, { id });
    return processContact(result);
  }

  async getContactByNumber(number) {
    const query = `SELECT users.*
    FROM users
    WHERE users.number = $(number);`;

    const result = await pg.one(query, { number });
    return result;
  }

  async listContacts() {
    const query = `WITH latest_messages AS (
      select *, row_number() over(partition by user_id order by time desc) as rn from messages
    )
    SELECT users.*, latest_messages.message, latest_messages.time, latest_messages.outgoing
    FROM users
    LEFT JOIN latest_messages ON latest_messages.user_id = users.id and latest_messages.rn = 1
    ORDER BY time DESC;`;

    const result = await pg.any(query);
    return result.map(processContact);
  }

  async createContact(name, number, jigsawId) {
    if (!jigsawId) jigsawId = null;

    const query = `INSERT INTO users (name, number, jigsaw_id)
    VALUES( $(name), $(number), $(jigsawId)) RETURNING id`;

    const result = await pg.one(query, { name, number, jigsawId });
    return result;
  }
}

module.exports = PostgresGateway;
