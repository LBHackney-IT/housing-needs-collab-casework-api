var pg = require('../lib/PostgresDb');

const processContact = function(contact) {
  let c = {
    id: contact.id,
    name: contact.name,
    number: contact.number,
    jigsawId: contact.jigsaw_id,
    lastMessage: null
  };
  if (contact.time) {
    c.lastMessage = {
      outgoing: contact.outgoing,
      message: contact.message,
      time: contact.time,
      userEmail: contact.user_email
    };
  }
  return c;
};

class PostgresGateway {
  async saveMessage(contactId, userId, direction, message) {
    // insert into messages table
    const insertQuery = `INSERT INTO messages (contact_id, user_id, outgoing, message)
      VALUES ($(contactId), $(userId), $(outgoing), $(message))`;

    await pg.none(insertQuery, {
      contactId,
      userId,
      outgoing: direction === 'outgoing',
      message
    });
  }

  async getMessages(contact_id) {
    const query = `SELECT *
    FROM messages
    WHERE contact_id = $(contact_id)
    ORDER BY time ASC`;

    const result = await pg.any(query, { contact_id });
    return result;
  }

  async getContact(id) {
    const query = `WITH latest_messages AS (
      select *, row_number() over(partition by contact_id order by time desc) as rn from messages WHERE contact_id = $(id)
    )
    SELECT contacts.*, latest_messages.message, latest_messages.time, latest_messages.outgoing
    FROM contacts
    LEFT JOIN latest_messages ON latest_messages.contact_id = contacts.id and latest_messages.rn = 1
    WHERE contacts.id = $(id);`;

    const result = await pg.one(query, { id });
    return processContact(result);
  }

  async getContactByNumber(number) {    
    const query = `SELECT contacts.*
    FROM contacts
    WHERE contacts.number = $(number);`;   
    let result;     
    result = await pg.one(query, { number });
          
    return result;
  }

  async getLastUser(contactId) {
    const query = `WITH msgs AS (SELECT messages.* FROM messages
    WHERE contact_id = $(contactId) AND outgoing = TRUE
    ORDER BY time DESC
    LIMIT 1)
    SELECT users.*
    FROM users
    WHERE id = (SELECT msgs.user_id FROM msgs LIMIT 1);`;

    const result = await pg.any(query, { contactId });

    if (result.length > 0) {
      return result[0];
    }
  }

  async getUserByUsername(username) {
    const query = `SELECT users.*
    FROM users
    WHERE users.username = $(username);`;

    const result = await pg.any(query, { username });

    if (result.length > 0) {
      return result[0];
    }
  }

  async listContacts() {
    const queryParams = {};

    const query = `
    WITH latest_messages AS (
      select *, row_number() over(partition by contact_id order by time desc) as rn from messages JOIN users ON users.id = messages.user_id WHERE username != 'No Reply'
    )
    SELECT contacts.*, latest_messages.message, latest_messages.time, latest_messages.outgoing, latest_messages.email AS user_email
    FROM contacts
    LEFT JOIN latest_messages ON latest_messages.contact_id = contacts.id and latest_messages.rn = 1
    ORDER BY time DESC;`;

    const result = await pg.any(query, queryParams);
    return result.map(processContact);
  }

  async createContact(name, number, jigsawId) {
    if (!jigsawId) jigsawId = null;

    const query = `
    INSERT INTO contacts (name, number, jigsaw_id)
    VALUES($(name), $(number), $(jigsawId)) RETURNING *`;

    const result = await pg.one(query, { name, number, jigsawId });
    return result;
  }

  async createUser(username, email) {
    const query = `INSERT INTO users (username, email)
    VALUES($(username), $(email)) RETURNING *`;

    const result = await pg.one(query, { username, email });
    return result;
  }
}

module.exports = PostgresGateway;
