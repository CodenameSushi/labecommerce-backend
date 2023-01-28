-- Active: 1673886718756@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);


INSERT INTO users (id, name, email, password)
VALUES  
    ('u001', 'Fulano',   'fulano@gmail.com',    'senha123'),
    ('u002', 'Ciclano',  'ciclano@gmail.com',   'senha123'), 
    ('u003', 'Beltrano', 'beltrano@gmail.com',  'sennha123'), 
    ('u004', 'William',  'exercicio@gmail.com', 'exercicio123');


CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL
);




INSERT INTO products(id,name,price, description, image_url, category)
VALUES
    ('p001', 'G PRO X SUPERLIGHT',    800,  'item-description', 'image-url', 'Peripherals'), 
    ('p002', 'Razer Blackwidow Mini', 700,  'item-description', 'image-url', 'Peripherals'), 
    ('p003', 'Iphone 14',             7000, 'item-description', 'image-url', 'Electronics'), 
    ('p004', 'RTX 4070 TI',           6900, 'item-description', 'image-url', 'Hardware'),
    ('p005', 'i9-9900',               6000, 'item-description', 'image-url', 'Hardware'),
    ('p006', 'Iphone 13 Pro',         5000, 'item-description', 'image-url', 'Electronics');


CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer_id TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    paid INTEGER DEFAULT (0) NOT NULL,
    Foreign Key (buyer_id) REFERENCES users(id)
);

INSERT INTO purchases (id,buyer_id,total_price)
VALUES
    ('o001', 'u002', 800),
    ('o002', 'u002', 6900),
    ('o003', 'u003', 11000),
    ('o004', 'u003', 7500),
    ('o005', 'u004', 7000),
    ('o006', 'u004', 7000);


CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO purchases_products (purchase_id,product_id,quantity)
VALUES
    ('o001', 'p001', '1'),
    ('o002', 'p004', '1'),
    ('o003', 'p005', '1'),
    ('o003', 'p006', '1'),
    ('o004', 'p001', '1'),
    ('o004', 'p002', '1'),
    ('o004', 'p002', '1'),
    ('o004', 'p005', '1'),
    ('o005', 'p003', '1'),
    ('o006', 'p003', '1');

SELECT
    products.name,
    purchases.id AS purchaseId,
    products.id AS productId,
    products.category AS category,
    purchases_products.quantity AS quantity,
    purchases.total_price AS totalPrice,
    purchases.buyer_id AS buyer,
    purchases.created_at AS date

FROM purchases_products
INNER JOIN purchases ON purchases_products.purchase_id = purchaseId
INNER JOIN products ON purchases_products.product_id = productId;



--Get All Users


--Get All Products

SELECT * FROM products WHERE category= 'Peripherals';

INSERT INTO products (id, name, price, category) VALUES ;

DROP TABLE products;

SELECT * FROM products WHERE id= '001';

DELETE FROM users WHERE id='001';

DELETE FROM products WHERE id= '001';

UPDATE users SET email = "update@gmail.com" WHERE id='u002';

UPDATE products SET name = 'Iphone 12 Pro' WHERE id='p006';

--Exercicio 3 --

SELECT * FROM users;

--Get All Products

SELECT * FROM users ORDER BY email DESC;

SELECT * FROM products ORDER BY price ASC LIMIT 20 OFFSET 0;


SELECT * FROM products WHERE price > 1000 AND price < 6500 ORDER BY price ASC;

-- INSERT INTO users (id, email, password) VALUES ('004', 'exercicio@gmail.com', 'exercicio123');

-- INSERT INTO products (id, name, price, category) VALUES ('006', 'Iphone 13 Pro', 5000, 'Electronics');


DROP TABLE purchases;

SELECT * FROM purchases;

SELECT * FROM purchases WHERE buyer_id = "u002";



SELECT DATETIME('now');
SELECT * FROM users;

SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer_id = users.id;











    








