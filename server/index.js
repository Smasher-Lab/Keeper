import express from "express";
import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcrypt";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());

// ---------------------
// Database Connection
// ---------------------
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "keeper",
  password: "123456",
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("Keeper API running ✅");
});

// ---------------------------
// REGISTER 
// ---------------------------
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username & password required" });

    const uname = username.trim();

    const exists = await pool.query(
      "SELECT id FROM users WHERE LOWER(username) = LOWER($1)",
      [uname]
    );
    if (exists.rows.length > 0)
      return res.status(409).json({ error: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [uname, hashed]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------
// LOGIN 
// ---------
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username & password required" });

    const uname = username.trim();

    const result = await pool.query(
      "SELECT id, username, password FROM users WHERE LOWER(username) = LOWER($1)",
      [uname]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Incorrect password" });

    res.json({ id: user.id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

async function getUserId(username) {
  const res = await pool.query(
    "SELECT id FROM users WHERE LOWER(username) = LOWER($1)",
    [username.trim()]
  );
  return res.rows[0]?.id || null;
}
app.post("/api/notes/get", async (req, res) => {
  try {
    const { username, search = "" } = req.body;

    const user_id = await getUserId(username);
    if (!user_id) return res.status(400).json({ error: "Invalid username" });

    const result = await pool.query(
      `
      SELECT id, title, content
      FROM notes
      WHERE user_id = $1
        AND (title ILIKE $2 OR content ILIKE $2)
      ORDER BY id DESC
      `,
      [user_id, `%${search}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/notes/add", async (req, res) => {
  try {
    const { username, title, content } = req.body;

    const user_id = await getUserId(username);
    if (!user_id) return res.status(400).json({ error: "Invalid username" });

    const result = await pool.query(
      "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content || "", user_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("POST /notes/add error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------
//  UPDATE NOTE
// -----------
app.put("/api/notes/update", async (req, res) => {
  try {
    const { username, id, title, content } = req.body;

    const user_id = await getUserId(username);
    if (!user_id) return res.status(400).json({ error: "Invalid username" });

    const result = await pool.query(
      "UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, content || "", id, user_id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Note not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /notes/update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------
// DELETE NOTE
// ----------------
app.delete("/api/notes/delete", async (req, res) => {
  try {
    const { username, id } = req.body;

    const user_id = await getUserId(username);
    if (!user_id) return res.status(400).json({ error: "Invalid username" });

    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, user_id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted", id });
  } catch (err) {
    console.error("DELETE /notes/delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
