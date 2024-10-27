import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { collection, query, getDocs, where } from 'firebase/firestore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import '../styles/MyGames.css';

const MyGames = () => {
  const { user } = useAuth();
  const [games, setGames] = useState({
    joinedActive: [],
    hostedActive: [],
    inactiveJoined: [],
    inactiveHosted: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({
    joinedActive: false,
    hostedActive: false,
    inactiveJoined: false,
    inactiveHosted: false,
  });

  // Bulletproof date parsing
  const parseDateTime = (dateTimeStr) => {
    try {
      // Handle the specific format "2024-10-26 19:00:00+00:00"
      if (typeof dateTimeStr === 'string' && dateTimeStr.includes('+00:00')) {
        // Remove the timezone part and parse
        const cleaned = dateTimeStr.replace('+00:00', 'Z');
        const date = new Date(cleaned);
        return date.getTime() ? date : new Date(); // Fallback to current date if invalid
      }
      // Try parsing as regular date string
      const date = new Date(dateTimeStr);
      return date.getTime() ? date : new Date(); // Fallback to current date if invalid
    } catch (error) {
      console.error('Date parsing error:', error);
      return new Date(); // Fallback to current date if parsing fails
    }
  };

  useEffect(() => {
    const fetchGames = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        // Get current date for comparison
        const now = new Date();

        // Fetch all games where user is host
        const hostedGamesQuery = query(
          collection(db, 'games'),
          where('hostId', '==', user.uid)
        );
        const hostedGamesSnapshot = await getDocs(hostedGamesQuery);
        
        // Fetch all game_players subcollections where user is a player
        const joinedGamesPromises = [];
        const gamesRef = collection(db, 'games');
        const gamesSnapshot = await getDocs(gamesRef);
        
        gamesSnapshot.forEach(gameDoc => {
          const playersQuery = query(
            collection(db, 'games', gameDoc.id, 'game_players'),
            where('userId', '==', user.uid)
          );
          joinedGamesPromises.push(
            getDocs(playersQuery).then(playerSnap => {
              if (!playerSnap.empty) {
                return {
                  ...gameDoc.data(),
                  id: gameDoc.id
                };
              }
              return null;
            })
          );
        });

        const joinedGamesResults = await Promise.all(joinedGamesPromises);
        const joinedGames = joinedGamesResults.filter(game => game !== null);

        // Sort games into categories
        const categorizedGames = {
          joinedActive: [],
          hostedActive: [],
          inactiveJoined: [],
          inactiveHosted: []
        };

        // Process hosted games
        hostedGamesSnapshot.forEach(doc => {
          const gameData = { id: doc.id, ...doc.data() };
          
          // Ensure startTime exists in the schedule
          if (gameData.schedule && gameData.schedule.startTime) {
            const startTime = parseDateTime(gameData.schedule.startTime);
            
            if (startTime > now) {
              categorizedGames.hostedActive.push(gameData);
            } else {
              categorizedGames.inactiveHosted.push(gameData);
            }
          } else {
            // If no valid start time, default to active
            categorizedGames.hostedActive.push(gameData);
          }
        });

        // Process joined games (excluding hosted games)
        joinedGames.forEach(gameData => {
          if (gameData.hostId === user.uid) return;
          
          if (gameData.schedule && gameData.schedule.startTime) {
            const startTime = parseDateTime(gameData.schedule.startTime);
            
            if (startTime > now) {
              categorizedGames.joinedActive.push(gameData);
            } else {
              categorizedGames.inactiveJoined.push(gameData);
            }
          } else {
            // If no valid start time, default to active
            categorizedGames.joinedActive.push(gameData);
          }
        });

        // Sort each category by start time
        Object.keys(categorizedGames).forEach(key => {
          categorizedGames[key].sort((a, b) => {
            const dateA = parseDateTime(a.schedule?.startTime);
            const dateB = parseDateTime(b.schedule?.startTime);
            return dateA - dateB;
          });
        });

        setGames(categorizedGames);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [user]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDateTime = (dateTimeStr) => {
    try {
      const date = parseDateTime(dateTimeStr);
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  const GameContent = ({ game }) => (
    <div className="game-section-content">
      <p><strong>Sport Type:</strong> {game.sport}</p>
      <p><strong>Date & Time:</strong> {formatDateTime(game.schedule?.startTime)}</p>
      <p><strong>Location:</strong> {game.location?.address}</p>
      <p><strong>Game Description:</strong> {game.description}</p>
      <p><strong>Players:</strong> {game.currentPlayers || 0} / {game.maxPlayers}</p>
      <p><strong>Skill Level:</strong> {game.skillLevel}</p>
      {game.fee > 0 && <p><strong>Fee:</strong> ${game.fee}</p>}
      {game.equipment && <p><strong>Equipment:</strong> {game.equipment}</p>}
    </div>
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="my-games-container">
          <div className="loading-state">Loading your games...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="my-games-container">
          <div className="error-state">{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="my-games-container">
        <h1>My Games</h1>

        <div className="games-list">
          {Object.entries({
            joinedActive: { title: 'Joined Active', data: games.joinedActive },
            hostedActive: { title: 'Hosted Active', data: games.hostedActive },
            inactiveJoined: { title: 'Inactive Joined Games', data: games.inactiveJoined },
            inactiveHosted: { title: 'Inactive Hosted Games', data: games.inactiveHosted }
          }).map(([key, { title, data }]) => (
            <div key={key} className="games-section">
              <h2 
                onClick={() => toggleSection(key)} 
                className="toggle-header"
              >
                {title} ({data.length})
                <span className="toggle-icon">
                  {openSections[key] ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                </span>
              </h2>
              {openSections[key] && (
                <div className="games-content-wrapper">
                  {data.length === 0 ? (
                    <div className="empty-state">No games in this category</div>
                  ) : (
                    data.map(game => (
                      <GameContent key={game.id} game={game} />
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyGames;