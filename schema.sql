CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  number VARCHAR(32) NOT NULL,
  outgoing BOOLEAN,
  message TEXT,
  username VARCHAR(128),
  time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX messages_number ON messages(number);