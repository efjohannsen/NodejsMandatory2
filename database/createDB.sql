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

CREATE TABLE refreshTokens ( 
  token CHAR(124) UNIQUE,
  id int(11),
  FOREIGN KEY (id) REFERENCES users(id)
);

INSERT INTO users (id, username, password) VALUES
(1, 'John', '123456'),
(2, 'Jonas', '123');


insert into refreshTokens (id, token) VALUES (15, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiaGVqIiwiaWF0IjoxNjA2NzcxMDA5fQ.Uc5h7Z_l3fZonrpbwEnhyDTOxDLjz16Om1zjhAwaL0w");


select * from users;  

