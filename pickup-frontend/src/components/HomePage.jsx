import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import GameCard from './games/GameCard';


const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // You can access user details here
    console.log('User email:', user.email);
    console.log('User display name:', user.displayName);
    console.log('User ID:', user.uid);
  }, [user, navigate]);

  const gameData = {
  sport: "Basketball",
  title: "Sunday Morning 3v3",
  time: new Date("2024-10-27T10:00:00"),
  location: "Central Park Court",
  currentPlayers: 4,
  maxPlayers: 6,
  skillLevel: "Intermediate",
  hostName: "Loan Smith",
  hostRating: 4.8
};


  return (
    <>
      <Navbar /><div>
        <h1>Welcome, {user?.displayName || 'User'}!</h1>
        <GameCard game={gameData} />
      </div>
      <Footer/>
    </>
  );
};

export default HomePage;