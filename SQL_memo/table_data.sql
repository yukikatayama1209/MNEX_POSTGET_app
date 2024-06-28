CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    point INT
);

CREATE TABLE prices(
    id SERIAL PRIMARY KEY,
    product VARCHAR(255) NOT NULL,
    purchase_date Date NOT NULL,
    shop_location TEXT NOT NULL,
    product_photo TEXT NOT NULL,
    comments TEXT NOT NULL,
)

CREATE TABLE hobbys(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    price_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (price_id) REFERENCES prices(id)
)