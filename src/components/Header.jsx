import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faGear } from "@fortawesome/free-solid-svg-icons";

export default function Header({ toggleMenu, search, setSearch }) {

  return (
    <header>
      <div className="header-container">

        {/* Hamburger */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Title */}
        <h1 className="app-title">Keep</h1>

        {/* Search Box */}
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />

          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button className="clear-btn" onClick={() => setSearch("")}>
              &times;
            </button>
          )}
        </div>

        <FontAwesomeIcon icon={faGear} className="settings-icon" />
      </div>

      <hr className="divider" />
    </header>
  );
}
