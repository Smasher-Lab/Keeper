import React from "react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();

  // getting username from localStorage
  const username = localStorage.getItem("username") || "User";

  const handleBack = () => {
    navigate("/notes");
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <div className="account-container">
      <div className="profile-box">
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="profile"
          className="profile-image"
        />
        <p className="username">{username}</p>
      </div>

      <div className="account-buttons">
        <button onClick={handleBack}>Go Back</button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}
