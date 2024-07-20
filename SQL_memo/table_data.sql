DROP TABLE IF EXISTS users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    point INT
);

DROP TABLE IF EXISTS prices;
DROP TABLE IF EXISTS hobbys;

CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    purchase_date DATE NOT NULL,
    shop_location TEXT NOT NULL,
    price INT NOT NULL,
    importance BOOLEAN NOT NULL DEFAULT FALSE,
    product_photo TEXT NOT NULL,
    comments TEXT
);

CREATE TABLE hobbys (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    purchase_date DATE NOT NULL,
    shop_location TEXT NOT NULL,
    hobby_photo TEXT NOT NULL,
    comments TEXT NOT NULL,
    good INT DEFAULT 0 NOT NULL
);
