import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Account from "./components/Account";
import NotesPage from "./components/NotesPage";
import Footer from "./components/Footer";
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/account" element={<Account />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
