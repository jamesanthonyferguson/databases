USE chatterbox;

CREATE TABLE messages (
  id INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  username VARCHAR(40) NULL DEFAULT NULL,
  roomname VARCHAR(40) NULL DEFAULT 'Lobby',
  text VARCHAR(200) NULL DEFAULT NULL,
  time DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  username VARCHAR(40) NULL DEFAULT NULL,
  message_id VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (id)
);