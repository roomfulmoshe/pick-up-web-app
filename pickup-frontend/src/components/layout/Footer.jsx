import React from 'react';
import '../../styles/Footer.css';


const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>PICKUP</h2>
          <p>Find your next game.</p>
        </div>

        {/* Navigation Links */}
        <div className="footer-nav">
          <div className="footer-nav-column">
            <h3>Play</h3>
            <a href="/find">Find Games</a>
            <a href="/host">Host Game</a>
            <a href="/schedule">Schedule</a>
            <a href="/teams">Teams</a>
          </div>
          
          <div className="footer-nav-column">
            <h3>Company</h3>
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
            <a href="/careers">Careers</a>
            <a href="/contact">Contact</a>
          </div>
          
          <div className="footer-nav-column">
            <h3>Legal</h3>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/cookies">Cookies</a>
            <a href="/licensing">Licensing</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} Pickup. All rights reserved.</p>
          <div className="footer-meta-links">
            <a href="/sitemap">Sitemap</a>
            <span>•</span>
            <a href="/accessibility">Accessibility</a>
            <span>•</span>
            <a href="/help">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;