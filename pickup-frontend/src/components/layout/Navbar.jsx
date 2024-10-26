// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css'; // Import CSS for styling

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">PickUp</h1>
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/">FIND</Link></li>
        <li><Link to="/host">HOST</Link></li>
        <li><Link to="/services">My Games</Link></li>
        <li><Link to="/contact">About</Link></li>
      </ul>
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
}

export default Navbar;