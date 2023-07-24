import React from "react";
import { Link, Route, Routes, Router } from "react-router-dom";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import Details from "./Details";

export default function NavBar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-name">
        Akario
      </Link>
      <ul>
        <li>
          <Link to="/Blogs">Blogs</Link>
        </li>
        <li>
          <Link to="/About">Listings</Link>
        </li>
        <li>
          <Link to="/Contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
