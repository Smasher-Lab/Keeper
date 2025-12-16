import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ open }) {
  const navigate = useNavigate();

  return (
    <div className={`sidebar ${open ? "open" : ""}`}>
      <ul>
        <li onClick={() => navigate("/notes")}>Notes</li>
        <li>Reminders</li>
        <li>Edit Labels</li>
        <li>Archive</li>
        <li>Bin</li>
        <li onClick={() => navigate("/account")}>Account</li>
      </ul>
    </div>
  );
}
