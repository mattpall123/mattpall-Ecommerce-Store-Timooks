-- 1. Roles
INSERT INTO role (name) VALUES 
('CUSTOMER'),
('ADMIN');

-- 2. Categories
INSERT INTO category (name) VALUES 
('Fiction'),
('Science Fiction'),
('Fantasy'),
('Programming'),
('Biography'),
('Thriller');

-- 3. Publishers
INSERT INTO publisher (name) VALUES 
('Penguin Books'),
('HarperCollins'),
('O''Reilly Media'),
('Tor Books'),
('Simon & Schuster'),
('Pearson'),
('Random House'),
('Bantam');

-- 4. Accounts
-- Customer: Leia Organa (Password: testpass)
INSERT INTO account (role_id, email, password_hash, first_name, last_name, phone, credit_card)
VALUES (
    (SELECT role_id FROM role WHERE name = 'CUSTOMER'),
    'customer@test.com',
    'testpass',
    'Leia',
    'Organa',
    '555-1234',
    '4242'  -- Dummy Card ending
);

-- Admin: Ada Code (Password: adminpass)
INSERT INTO account (role_id, email, password_hash, first_name, last_name, phone, credit_card)
VALUES (
    (SELECT role_id FROM role WHERE name = 'ADMIN'),
    'admin@test.com',
    'adminpass',
    'Ada',
    'Code',
    NULL,
    NULL
);

-- 5. Books (Inventory)

-- SCIENCE FICTION
INSERT INTO book (category_id, publisher_id, title, author, isbn, description, price, stock, page_count, publication_year, cover_image) VALUES
((SELECT category_id FROM category WHERE name = 'Science Fiction'), (SELECT publisher_id FROM publisher WHERE name = 'Tor Books'), 'Dune', 'Frank Herbert', '9780441172719', 'Epic saga of a desert planet and political intrigue.', 15.50, 50, 688, 1965, 'dune.jpg'),
((SELECT category_id FROM category WHERE name = 'Science Fiction'), (SELECT publisher_id FROM publisher WHERE name = 'HarperCollins'), 'Foundation', 'Isaac Asimov', '9780553293357', 'The story of our future begins with the history of our past.', 14.99, 30, 255, 1951, 'foundation.jpg'),
((SELECT category_id FROM category WHERE name = 'Science Fiction'), (SELECT publisher_id FROM publisher WHERE name = 'Penguin Books'), 'Neuromancer', 'William Gibson', '9780441569595', 'The book that launched the cyberpunk genre.', 12.50, 25, 271, 1984, 'neuromancer.jpg'),
((SELECT category_id FROM category WHERE name = 'Science Fiction'), (SELECT publisher_id FROM publisher WHERE name = 'Random House'), 'Snow Crash', 'Neal Stephenson', '9780553380958', 'A mind-altering romp through a future America.', 16.00, 40, 480, 1992, 'snowcrash.jpg');

-- PROGRAMMING
INSERT INTO book (category_id, publisher_id, title, author, isbn, description, price, stock, page_count, publication_year, cover_image) VALUES
((SELECT category_id FROM category WHERE name = 'Programming'), (SELECT publisher_id FROM publisher WHERE name = 'O''Reilly Media'), 'Head First Java', 'Kathy Sierra', '9780596009205', 'A brain-friendly guide to Java programming.', 45.99, 10, 720, 2005, 'java.jpg'),
((SELECT category_id FROM category WHERE name = 'Programming'), (SELECT publisher_id FROM publisher WHERE name = 'Pearson'), 'Clean Code', 'Robert C. Martin', '9780132350884', 'A Handbook of Agile Software Craftsmanship.', 50.00, 20, 464, 2008, 'cleancode.jpg'),
((SELECT category_id FROM category WHERE name = 'Programming'), (SELECT publisher_id FROM publisher WHERE name = 'O''Reilly Media'), 'Design Patterns', 'Erich Gamma', '9780201633610', 'Elements of Reusable Object-Oriented Software.', 55.00, 15, 395, 1994, 'designpatterns.jpg'),
((SELECT category_id FROM category WHERE name = 'Programming'), (SELECT publisher_id FROM publisher WHERE name = 'O''Reilly Media'), 'JavaScript: The Good Parts', 'Douglas Crockford', '9780596517748', 'Unearthing the excellence in JavaScript.', 29.99, 35, 176, 2008, 'jsgoodparts.jpg');

-- FANTASY
INSERT INTO book (category_id, publisher_id, title, author, isbn, description, price, stock, page_count, publication_year, cover_image) VALUES
((SELECT category_id FROM category WHERE name = 'Fantasy'), (SELECT publisher_id FROM publisher WHERE name = 'HarperCollins'), 'The Hobbit', 'J.R.R. Tolkien', '9780007458424', 'An unexpected journey.', 12.00, 120, 310, 1937, 'hobbit.jpg'),
((SELECT category_id FROM category WHERE name = 'Fantasy'), (SELECT publisher_id FROM publisher WHERE name = 'HarperCollins'), 'A Game of Thrones', 'George R.R. Martin', '9780553103540', 'Winter is coming.', 18.00, 60, 694, 1996, 'gameofthrones.jpg'),
((SELECT category_id FROM category WHERE name = 'Fantasy'), (SELECT publisher_id FROM publisher WHERE name = 'Tor Books'), 'The Way of Kings', 'Brandon Sanderson', '9780765326355', 'Book One of the Stormlight Archive.', 22.00, 45, 1007, 2010, 'wayofkings.jpg'),
((SELECT category_id FROM category WHERE name = 'Fantasy'), (SELECT publisher_id FROM publisher WHERE name = 'Penguin Books'), 'The Name of the Wind', 'Patrick Rothfuss', '9780756404741', 'The Kingkiller Chronicle: Day One.', 16.50, 30, 662, 2007, 'namewind.jpg');

-- THRILLER
INSERT INTO book (category_id, publisher_id, title, author, isbn, description, price, stock, page_count, publication_year, cover_image) VALUES
((SELECT category_id FROM category WHERE name = 'Thriller'), (SELECT publisher_id FROM publisher WHERE name = 'Penguin Books'), 'Gone Girl', 'Gillian Flynn', '9780307588373', 'A dark psychological thriller.', 10.99, 80, 419, 2012, 'gonegirl.jpg'),
((SELECT category_id FROM category WHERE name = 'Thriller'), (SELECT publisher_id FROM publisher WHERE name = 'Random House'), 'The Da Vinci Code', 'Dan Brown', '9780385504201', 'A murder in the Louvre reveals a sinister secret.', 14.50, 100, 489, 2003, 'davinci.jpg'),
((SELECT category_id FROM category WHERE name = 'Thriller'), (SELECT publisher_id FROM publisher WHERE name = 'Penguin Books'), 'The Girl on the Train', 'Paula Hawkins', '9781594634024', 'A psychological thriller novel.', 13.00, 55, 323, 2015, 'girltrain.jpg'),
((SELECT category_id FROM category WHERE name = 'Thriller'), (SELECT publisher_id FROM publisher WHERE name = 'Simon & Schuster'), 'Angels & Demons', 'Dan Brown', '9780671027360', 'Robert Langdon first adventure.', 12.99, 40, 616, 2000, 'angelsdemons.jpg');

-- FICTION
INSERT INTO book (category_id, publisher_id, title, author, isbn, description, price, stock, page_count, publication_year, cover_image) VALUES
((SELECT category_id FROM category WHERE name = 'Fiction'), (SELECT publisher_id FROM publisher WHERE name = 'Penguin Books'), '1984', 'George Orwell', '9780451524935', 'Dystopian social science fiction.', 11.00, 150, 328, 1949, '1984.jpg'),
((SELECT category_id FROM category WHERE name = 'Fiction'), (SELECT publisher_id FROM publisher WHERE name = 'HarperCollins'), 'To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'A novel about the serious issues of rape and racial inequality.', 13.50, 90, 281, 1960, 'mockingbird.jpg'),
((SELECT category_id FROM category WHERE name = 'Fiction'), (SELECT publisher_id FROM publisher WHERE name = 'Penguin Books'), 'The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'The American Dream in the Roaring Twenties.', 10.50, 110, 180, 1925, 'gatsby.jpg'),
((SELECT category_id FROM category WHERE name = 'Fiction'), (SELECT publisher_id FROM publisher WHERE name = 'Penguin Books'), 'Pride and Prejudice', 'Jane Austen', '9780141439518', 'Romantic novel of manners.', 9.99, 60, 279, 1813, 'prideprejudice.jpg');

-- BIOGRAPHY
INSERT INTO book (category_id, publisher_id, title, author, isbn, description, price, stock, page_count, publication_year, cover_image) VALUES
((SELECT category_id FROM category WHERE name = 'Biography'), (SELECT publisher_id FROM publisher WHERE name = 'Simon & Schuster'), 'Steve Jobs', 'Walter Isaacson', '9781451648539', 'The exclusive biography of Steve Jobs.', 20.00, 45, 656, 2011, 'stevejobs.jpg'),
((SELECT category_id FROM category WHERE name = 'Biography'), (SELECT publisher_id FROM publisher WHERE name = 'Penguin Books'), 'Becoming', 'Michelle Obama', '9781524763138', 'The memoir of former United States First Lady.', 19.50, 85, 448, 2018, 'becoming.jpg'),
((SELECT category_id FROM category WHERE name = 'Biography'), (SELECT publisher_id FROM publisher WHERE name = 'Random House'), 'Educated', 'Tara Westover', '9780399590504', 'A Memoir about growing up in a survivalist family.', 17.00, 50, 334, 2018, 'educated.jpg'),
((SELECT category_id FROM category WHERE name = 'Biography'), (SELECT publisher_id FROM publisher WHERE name = 'Bantam'), 'The Diary of a Young Girl', 'Anne Frank', '9780553296983', 'The writings from the Dutch language diary kept by Anne Frank.', 7.99, 100, 283, 1947, 'annefrank.jpg');