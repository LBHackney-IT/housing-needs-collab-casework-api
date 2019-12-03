CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NULL,
  number VARCHAR(32) NOT NULL,
  jigsaw_id INTEGER NULL
);
CREATE UNIQUE INDEX users_number ON users(number);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  outgoing BOOLEAN,
  message TEXT,
  username VARCHAR(128),
  time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX messages_user_id ON messages(user_id);