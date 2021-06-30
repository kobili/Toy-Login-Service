CREATE DATABASE toy_login_api;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    uid VARCHAR(50),
    email VARCHAR(254),
    password VARCHAR(400)
);