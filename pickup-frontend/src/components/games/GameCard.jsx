import React, { useState }  from 'react';
import '../../styles/GameCard.css'; // Import CSS for styling


//Data Needed for this component
//   const gameData = {
//   sport: "Basketball",
//   title: "Sunday Morning 3v3",
//   time: new Date("2024-10-27T10:00:00"),
//   location: "Central Park Court",
//   currentPlayers: 4,
//   maxPlayers: 6,
//   skillLevel: "Intermediate",
//   hostName: "Loan Smith",
//   hostRating: 4.8
// };

const GameCard = ({ game }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
  };
  return (
    
    <div className="game-card">
      <div className="game-card__gradient-overlay" />
      <div className="game-card__gradient-overlay" />


      <div className="game-card__action-buttons">
  <button 
    className={`game-card__action-button ${isDisliked ? 'dislike-active' : ''}`}
    onClick={handleDislike}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
  <button 
    className={`game-card__action-button ${isLiked ? 'like-active' : ''}`}
    onClick={handleLike}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </button>
</div>




      
      <div className="game-card__content">
        <div className="game-card__sport-badge">
          {game.sport}
          <div className="game-card__skill-level">{game.skillLevel}</div>
        </div>

        <div className="game-card__main-info">
          <h1 className="game-card__title">{game.title}</h1>
          
          <div className="game-card__host">
            <div className="game-card__host-avatar">
              {game.hostPhoto ? (
                <img src={game.hostPhoto} alt={game.hostName} />
              ) : (
                <div>{game.hostName[0]}</div>
              )}
            </div>
            <div className="game-card__host-info">
              <span>Hosted by {game.hostName}</span>
              {game.hostRating && (
                <div className="game-card__host-rating">
                  ★ {game.hostRating.toFixed(1)}
                </div>
              )}
            </div>
          </div>

          <div className="game-card__details">
            <div className="game-card__detail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="8"/>
                <path d="M12 8v4l2 2"/>
              </svg>
              <span>{new Date(game.time).toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}</span>
            </div>

            <div className="game-card__detail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{game.location}</span>
            </div>

            <div className="game-card__detail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              <span>{game.currentPlayers} / {game.maxPlayers} Players</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;