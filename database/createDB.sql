DROP DATABASE IF EXISTS UsersDB;
CREATE DATABASE UsersDB CHARACTER SET utf8 COLLATE utf8_general_ci;
USE UsersDB;

CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(100) UNIQUE,
  password CHAR(61),
  email varchar(100),
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO users (id, username, password) VALUES
(1, 'John', '123456'),
(2, 'Jonas', '123');

select * from users;  

