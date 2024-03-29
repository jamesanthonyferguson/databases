CREATE DATABASE chatterbox;

USE chatterbox;

CREATE TABLE messages (
  id INTEGER NOT NULL AUTO_INCREMENT,
  userid VARCHAR(40) NULL DEFAULT NULL,
  roomname VARCHAR(40) NULL DEFAULT 'Lobby',
  message VARCHAR(200) NULL DEFAULT NULL,
  time DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id INTEGER NOT NULL AUTO_INCREMENT,
  username VARCHAR(40) NULL DEFAULT NULL,
  message_id VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (id)
);
