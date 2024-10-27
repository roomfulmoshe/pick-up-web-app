import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../styles/MyGames.css';

const MyGames = () => {
  const [openSections, setOpenSections] = useState({
    joinedActive: false,
    hostedActive: false,
    inactiveJoined: false,
    inactiveHosted: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const ToggleIcon = ({ isOpen }) => (
    <span className="toggle-icon">
      {isOpen ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      )}
    </span>
  );

  return (
    <>
      <Navbar />
      <div className="my-games-container">
        <h1>My Games</h1>

        <div className="games-list">
          <div className="games-section">
            <h2 onClick={() => toggleSection('joinedActive')} className="toggle-header">
              Joined Active
              <ToggleIcon isOpen={openSections.joinedActive} />
            </h2>
            {openSections.joinedActive && (
              <div className="game-section-content">
                <p><strong>Sport Type:</strong> Basketball</p>
                <p><strong>Date & Time:</strong> Nov 1, 2024, 6:00 PM</p>
                <p><strong>Location:</strong> 123 Main St, New York, NY</p>
                <p><strong>Game Description:</strong> Friendly game, no aggressive play.</p>
                <p><strong>Number of Spots Available:</strong> 3</p>
                <p><strong>Skill Level:</strong> Intermediate</p>
              </div>
            )}
          </div>

          <div className="games-section">
            <h2 onClick={() => toggleSection('hostedActive')} className="toggle-header">
              Hosted Active
              <ToggleIcon isOpen={openSections.hostedActive} />
            </h2>
            {openSections.hostedActive && (
              <div className="game-section-content">
                <p><strong>Sport Type:</strong> Soccer</p>
                <p><strong>Date & Time:</strong> Oct 30, 2024, 4:00 PM</p>
                <p><strong>Location:</strong> Central Park Field 5, NY</p>
                <p><strong>Game Description:</strong> Casual 5-a-side game. Bring your own water.</p>
                <p><strong>Number of Spots Available:</strong> 5</p>
                <p><strong>Skill Level:</strong> Beginner</p>
              </div>
            )}
          </div>

          <div className="games-section">
            <h2 onClick={() => toggleSection('inactiveJoined')} className="toggle-header">
              Inactive Joined Games
              <ToggleIcon isOpen={openSections.inactiveJoined} />
            </h2>
            {openSections.inactiveJoined && (
              <div className="game-section-content">
                <p><strong>Sport Type:</strong> Tennis</p>
                <p><strong>Date & Time:</strong> Oct 15, 2024, 10:00 AM</p>
                <p><strong>Location:</strong> Riverside Courts, NY</p>
                <p><strong>Game Description:</strong> Doubles match, intermediate players only.</p>
                <p><strong>Number of Spots Available:</strong> 0 (All spots taken)</p>
                <p><strong>Skill Level:</strong> Intermediate</p>
              </div>
            )}
          </div>

          <div className="games-section">
            <h2 onClick={() => toggleSection('inactiveHosted')} className="toggle-header">
              Inactive Hosted Games
              <ToggleIcon isOpen={openSections.inactiveHosted} />
            </h2>
            {openSections.inactiveHosted && (
              <div className="game-section-content">
                <p><strong>Sport Type:</strong> Volleyball</p>
                <p><strong>Date & Time:</strong> Sep 25, 2024, 2:00 PM</p>
                <p><strong>Location:</strong> Beach Volleyball Court, Miami, FL</p>
                <p><strong>Game Description:</strong> Beach game, bring sunscreen and water.</p>
                <p><strong>Number of Spots Available:</strong> 0 (Event completed)</p>
                <p><strong>Skill Level:</strong> Advanced</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyGames;

