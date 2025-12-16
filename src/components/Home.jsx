import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Home({ search }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const username = localStorage.getItem("username");

  const fetchNotes = async (query = "") => {
    try {
      setLoading(true);
      const res = await axios.post("/api/notes/get", {
        username,
        search: query,
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchNotes(search.trim());
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const addNote = async () => {
    if (!title.trim() && !content.trim()) return;

    await axios.post("/api/notes/add", {
      username,
      title,
      content,
    });

    setTitle("");
    setContent("");
    fetchNotes(search);
  };

  const deleteNote = async (id) => {
    await axios.delete("/api/notes/delete", {
      data: { username, id },
    });

    fetchNotes(search);
  };

  return (
    <div className="home-container">
      <div className="note-input-area">
        <input
          placeholder="Take a note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={addNote}>Add</button>
      </div>

      <div className="notes-display">
        <h2>{search ? `Results for "${search}"` : "My Notes"}</h2>

        {loading && <p>Loading...</p>}

        <div className="notes-grid">
          {!loading && notes.length === 0 && <p>No notes found</p>}

          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button
                className="delete-btn"
                onClick={() => deleteNote(note.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}