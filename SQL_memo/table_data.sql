CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    point INT
);

CREATE TABLE prices(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    purchase_date DATE NOT NULL,
    shop_location TEXT NOT NULL,
    product_photo TEXT NOT NULL,
    comments TEXT NOT NULL
);

CREATE TABLE hobbys(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    price_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (price_id) REFERENCES prices(id)
);

-- 依存関係を含めて prices テーブルを削除
DROP TABLE IF EXISTS prices CASCADE;

-- hobbys テーブルを削除
DROP TABLE IF EXISTS hobbys;

-- prices テーブルを再作成
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    purchase_date DATE NOT NULL,
    shop_location TEXT NOT NULL,
    product_photo TEXT NOT NULL,
    comments TEXT NOT NULL
);

-- hobbys テーブルを再作成
CREATE TABLE hobbys (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    hobby_photo TEXT NOT NULL,
    comments TEXT NOT NULL,
    good INT DEFAULT 0 NOT NULL
);
