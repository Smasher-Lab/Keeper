import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./SIdebar";
import Home from "./Home";

export default function NotesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleMenu = () => setIsSidebarOpen(prev => !prev);

  return (
    <>
      <Header 
        toggleMenu={toggleMenu}
        search={search}
        setSearch={setSearch}
      />

      <Sidebar open={isSidebarOpen} />
      <Home search={search} />
    </>
  );
}
