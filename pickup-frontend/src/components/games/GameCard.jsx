import React, { useState } from 'react';
import '../../styles/GameCard.css';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { doc, serverTimestamp , collection, setDoc} from 'firebase/firestore';


const GameCard = ({ game, onDislike, onReserve }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reservationError, setReservationError] = useState(null);
  const { user } = useAuth();

  if (!game) {
    return null;
  }

  const cardStyle = {
    backgroundImage: `url(${game.photoURL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setIsDisliked(false);
    setIsFlipped(true);
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    setIsDisliked(!isDisliked);
    setIsLiked(false);
    onDislike(e);
  };

  const handleFlipBack = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
  };



  const handleReserveClick = async (e) => {
      e.stopPropagation();
      setIsReserving(true);
      setReservationError(null);

      try {
        // Check if the game is full
        if (game.currentPlayers >= game.maxPlayers) {
          throw new Error('Game is full');
        }

        // Create a reference to the game_players subcollection
        const gamePlayerRef = doc(
          collection(db, 'games', game.id, 'game_players'),
          user.uid
        );

        // Add the player to the game_players subcollection
        await setDoc(gamePlayerRef, {
          gameId: game.id,
          userId: user.uid,
          status: game.currentPlayers < game.maxPlayers ? 'confirmed' : 'waitlist',
          joinedAt: serverTimestamp()
        });

        // // Create a record in user_games collection for easy querying
        // const userGameRef = doc(db, 'user_games', `${user.uid}_${game.id}`);
        // await setDoc(userGameRef, {
        //   userId: user.uid,
        //   gameId: game.id,
        //   role: 'player',
        //   status: game.currentPlayers < game.maxPlayers ? 'confirmed' : 'waitlist',
        //   startTime: game.schedule.startTime
        // });

        // Notify parent component of successful reservation
        onReserve(e);
        handleFlipBack(e);

      } catch (error) {
        console.error('Error reserving spot:', error);
        setReservationError(
          error.message === 'Game is full' 
            ? 'This game is full. You can join the waitlist.'
            : 'Failed to reserve spot. Please try again.'
        );
      } finally {
        setIsReserving(false);
      }
    };


  return (
    <div className={`game-card-container ${isFlipped ? 'is-flipped' : ''}`}>
      <div 
        className="game-card game-card-front" 
        style={cardStyle}
      >
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
                {game.hostName}
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
                <span>{new Date(game.schedule.startTime).toLocaleString(undefined, {
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
                <span>{game.location.address}</span>
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

      <div className="game-card game-card-back">
        <button className="back-button" onClick={handleFlipBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        <div className="game-details">
          <h2>Game Details</h2>
          
          <div className="details-section">
            <h3>Equipment Needed</h3>
            <p>{game.equipment || 'None specified'}</p>
          </div>

          <div className="details-section">
            <h3>Description</h3>
            <p>{game.description || 'No description provided'}</p>
          </div>

          <div className="details-section">
            <h3>Additional Info</h3>
            <ul>
              <li>Duration: {game.startTime || 'Contact Host'}</li>
              <li>Skill: {game.skillLevel || 'Not specified'}</li>
              <li>Fee: {game.fee ? `$${game.fee}` : 'Free'}</li>
            </ul>
          </div>

          {reservationError && (
            <div className="reservation-error">
              {reservationError}
            </div>
          )}

          <button 
            className="reserve-button"
            onClick={handleReserveClick}
            disabled={isReserving}
          >
            {isReserving 
              ? 'Reserving...' 
              : game.currentPlayers >= game.maxPlayers 
                ? 'Join Waitlist'
                : 'Reserve Your Spot'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;