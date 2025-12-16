import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>Made By Lalith — {year}</p>
    </footer>
  );
}
