CREATE DATABASE Class3;

Use Class3;

CREATE TABLE disc (
	id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    artist VARCHAR(50),
    yearR INT,
    genre VARCHAR(20)
);

select * from disco;

INSERT INTO disc (title, artist, yearR, genre) VALUES
    ('The College Dropout', 'Kanye West', 2004, 'Hip-Hop'),
    ('My Beautiful Dark Twisted Fantasy', 'Kanye West', 2010, 'Hip-Hop'),
    ('Random Access Memories', 'Daft Punk', 2013, 'Electronic'),
    ('Is This It', 'The Strokes', 2001, 'Rock');
   
 DROP table disc;