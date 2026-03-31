CREATE TABLE Artist (
    artist_id INT PRIMARY KEY AUTO_INCREMENT,
    artist_name VARCHAR(100)
);


CREATE TABLE Album (
    album_id INT PRIMARY KEY AUTO_INCREMENT,
    album_name VARCHAR(100),
    artist_id INT,
    FOREIGN KEY (artist_id) REFERENCES Artist(artist_id)
);


CREATE TABLE Song (
    song_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100),
    duration VARCHAR(10),
    genre VARCHAR(50),
    album_id INT,
    popularity_score INT DEFAULT 0,
    FOREIGN KEY (album_id) REFERENCES Album(album_id)
);


CREATE TABLE Streaming_Stats (
    stream_id INT PRIMARY KEY AUTO_INCREMENT,
    song_id INT,
    streams_count INT,
    FOREIGN KEY (song_id) REFERENCES Song(song_id)
);


-- View
CREATE VIEW view_top_ranked AS
SELECT title, popularity_score
FROM Song
ORDER BY popularity_score DESC;

-- Trigger
CREATE TRIGGER set_default_popularity
BEFORE INSERT ON Song
FOR EACH ROW
SET NEW.popularity_score = 0;