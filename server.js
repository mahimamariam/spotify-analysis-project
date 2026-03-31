const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// 🔹 MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "csengi@Mahi2025",
  database: "spotify_analysis"
});

// 🔹 Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});


// 🔹 Test Route
app.get("/", (req, res) => {
  res.send("Node + MySQL is working!");
});
// 🔹 Get All Songs
app.get("/songs", (req, res) => {
  const sql = "SELECT * FROM Song";

  db.query(sql, (err, result) => {
    if (err) {
      res.send("Error fetching songs");
    } else {
      res.json(result);
    }
  });
});
// 🔹 Get All Artists
app.get("/artists", (req, res) => {
  const sql = "SELECT * FROM Artist";

  db.query(sql, (err, result) => {
    if (err) {
      res.send("Error fetching artists");
    } else {
      res.json(result);
    }
  });
});

// 🔹 Get All Albums
app.get("/albums", (req, res) => {
  const sql = "SELECT * FROM Album";

  db.query(sql, (err, result) => {
    if (err) {
      res.send("Error fetching albums");
    } else {
      res.json(result);
    }
  });
});

// 🔹 Get All Streaming Stats
app.get("/streaming", (req, res) => {
  const sql = "SELECT * FROM Streaming_Stats";

  db.query(sql, (err, result) => {
    if (err) {
      res.send("Error fetching streaming stats");
    } else {
      res.json(result);
    }
  });
});
// 🔹 Insert New Song
app.post("/add-song", (req, res) => {
  const { title, duration, genre, album_id } = req.body;

  const popularity = Math.floor(Math.random() * 100) + 1;

  const sql = `
    INSERT INTO Song (title, duration, genre, album_id, popularity_score)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, duration, genre, album_id, popularity], (err, result) => {
    if (err) {
      console.log(err);
      res.send(err.message);
    } else {
      res.send("Song added successfully");
    }
  });
});
// 🔹 Update Song
app.put("/update-song/:id", (req, res) => {
  const { title } = req.body;
  const id = req.params.id;

  const sql = "UPDATE Song SET title = ? WHERE song_id = ?";

  db.query(sql, [title, id], (err) => {
    if (err) res.send("Error updating");
    else res.send("Updated");
  });
});
// 🔹 Delete Song
app.delete("/delete-song/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM Song WHERE song_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error deleting song");
    } else {
      res.send("Song deleted successfully");
    }
  });
});
// Get Song Details (JOIN)
app.get("/song-details", (req, res) => {

  const sql = `
    SELECT 
  s.song_id,
  s.title,
  a.artist_name,
  al.album_name,
  s.popularity_score
FROM Song s
LEFT JOIN Album al ON s.album_id = al.album_id
LEFT JOIN Artist a ON al.artist_id = a.artist_id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      res.send("Error fetching joined data");
    } else {
      res.json(result);
    }
  });

});
app.get("/artist-analytics", (req, res) => {
  db.query("SELECT * FROM view_artist_analytics", (err, result) => {
    if (err) res.send("Error");
    else res.json(result);
  });
});
app.get("/top-ranked", (req, res) => {
  db.query("SELECT * FROM view_top_ranked LIMIT 20", (err, result) => {
    if (err) res.send("Error");
    else res.json(result);
  });
});
// 🔹 Dashboard Summary
app.get("/dashboard", (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM Artist) AS total_artists,
      (SELECT COUNT(*) FROM Album) AS total_albums,
      (SELECT COUNT(*) FROM Song) AS total_songs,
      (SELECT COUNT(*) FROM Streaming_Stats) AS total_streaming_records
  `;

  db.query(query, (err, result) => {
    if (err) res.send("Error fetching dashboard data");
    else res.json(result[0]);
  });
});
// 🔹 Top 5 Popular Songs
app.get("/top5", (req, res) => {
  const sql = `
    SELECT title, popularity_score 
    FROM Song 
    ORDER BY popularity_score DESC 
    LIMIT 5
  `;

  db.query(sql, (err, result) => {
    if (err) res.send("Error fetching top songs");
    else res.json(result);
  });
});
app.get("/top-songs", (req, res) => {
  const sql = `
    SELECT title, popularity_score
    FROM Song
    ORDER BY popularity_score DESC
    LIMIT 5
  `;

  db.query(sql, (err, result) => {
    if (err) {
      res.send("Error fetching top songs");
    } else {
      res.json(result);
    }
  });
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});