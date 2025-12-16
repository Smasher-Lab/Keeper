import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !password) {
      setMessage("Please enter a username and password.");
      return;
    }

    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Success!");

        if (isLogin) {
          // Save username to localStorage
          localStorage.setItem("username", data.username);
          localStorage.setItem("user_id", data.id);

          // Redirect after small delay
          setTimeout(() => {
            navigate("/notes");
          }, 800);
        }
      } else {
        setMessage(data.error || data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Request error:", error);
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">{isLogin ? "Log In" : "Register"}</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p className="toggle-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
          {isLogin ? " Register" : " Log in"}
        </span>
      </p>
      
    </div>
  );
}
