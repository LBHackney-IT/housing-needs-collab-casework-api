CREATE TABLE contacts
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NULL,
  number VARCHAR(32) NOT NULL,
  jigsaw_id INTEGER NULL
);
CREATE UNIQUE INDEX contacts_number ON contacts(number);
CREATE UNIQUE INDEX contacts_jigsaw_id ON contacts(jigsaw_id);

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  username VARCHAR(128) NULL,
  email VARCHAR(128) NULL
);
CREATE INDEX users_username ON users(username);

CREATE TABLE messages
(
  id SERIAL PRIMARY KEY,
  contact_id INTEGER REFERENCES contacts(id),
  user_id INTEGER REFERENCES users(id),
  outgoing BOOLEAN,
  message TEXT,
  time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX messages_contact_id ON messages(contact_id);