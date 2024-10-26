// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import '../../styles/Navbar.css'; // Import CSS for styling


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      // Navigate to login page after successful sign-out
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally show an error message to the user
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">PickUp</h1>
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/">FIND</Link></li>
        <li><Link to="/host">HOST</Link></li>
        <li><Link to="/mygames">My Games</Link></li>
        <li><Link to="/about">About</Link></li>
        <li>
          <button 
            onClick={handleSignOut} 
            className="sign-out-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Out...' : 'Sign Out'}
          </button>
        </li>
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