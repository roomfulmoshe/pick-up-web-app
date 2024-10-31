import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, query, getDocs, where, orderBy, Timestamp } from 'firebase/firestore';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import '../styles/homePage.css';
import GameSwiper from './games/GameSwiper';
import GameFilters from './games/GameFilters';
import { filterGames, getUniqueGameSports, getSkillLevels } from '../services/gameServices';


const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sports: [],
    location: null,
    maxDistance: null,
    skillLevel: null
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const convertTimestamp = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (timestamp.seconds) {
      return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
    }
    return null;
  };

  // Fetch games from Firestore
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const gamesQuery = query(
          collection(db, 'games'),
          where('status', '==', 'active'),
          where('hostId', '!=', user.uid),
          orderBy('schedule.startTime', 'asc')
        );

        const querySnapshot = await getDocs(gamesQuery);
        
        const games = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          return {
            ...data,
            id: doc.id,
            schedule: {
              ...data.schedule,
              startTime: data.schedule?.startTime ? convertTimestamp(data.schedule.startTime) : null,
              endTime: data.schedule?.endTime ? convertTimestamp(data.schedule.endTime) : null,
              isRecurring: data.schedule?.isRecurring || false
            },
            location: {
              ...data.location,
              coordinates: data.location?.coordinates || null
            },
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
            currentPlayers: data.currentPlayers || 0,
            maxPlayers: data.maxPlayers || 0,
            minPlayers: data.minPlayers || 0,
            photoURL: data.photoURL || '',
            skillLevel: data.skillLevel || 'beginner',
            hostRating: data.hostRating || 0,
            autoJoin: data.autoJoin ?? true,
            equipment: data.equipment || '',
            fee: data.fee || 0
          };
        });

        setAllGames(games);
        setFilteredGames(games); // Initially show all games
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchGames();
    }
  }, [user]);

  // Apply filters when they change
  useEffect(() => {
    const applyFilters = () => {
      const filtered = filterGames(allGames, filters);
      setFilteredGames(filtered);
    };

    applyFilters();
  }, [allGames, filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="container">
          <div className="games-grid">
            <GameFilters 
              onFilterChange={handleFilterChange}
              currentFilters={filters}
            />
            <div className="game-swiper-wrapper">
              {isLoading ? (
                <div className="loading-state">Loading games...</div>
              ) : error ? (
                <div className="error-state">{error}</div>
              ) : filteredGames.length === 0 ? (
                <div className="empty-state">No games match your filters.</div>
              ) : (
                <GameSwiper gamesData={filteredGames} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;