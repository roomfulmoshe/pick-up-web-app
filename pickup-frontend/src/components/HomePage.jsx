import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import GameCard from './games/GameCard';
import '../styles/homePage.css';


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



const gameDataArray = [
  {
    sport: "Basketball",
    title: "Sunday Morning 3v3",
    time: new Date("2024-10-27T10:00:00"),
    location: "Central Park Court",
    currentPlayers: 4,
    maxPlayers: 6,
    skillLevel: "Intermediate",
    hostName: "Loan Smith",
    hostRating: 4.8
  },
  {
    sport: "Soccer",
    title: "Weekly Kickoff",
    time: new Date("2024-10-28T18:30:00"),
    location: "Battery Park Field",
    currentPlayers: 8,
    maxPlayers: 10,
    skillLevel: "Advanced",
    hostName: "Rafael Mendes",
    hostRating: 4.6
  },
  {
    sport: "Tennis",
    title: "Doubles Match",
    time: new Date("2024-10-27T14:00:00"),
    location: "Chelsea Piers",
    currentPlayers: 3,
    maxPlayers: 4,
    skillLevel: "Beginner",
    hostName: "Sophia Chu",
    hostRating: 4.9
  },
  {
    sport: "Volleyball",
    title: "Evening Spike",
    time: new Date("2024-10-29T19:00:00"),
    location: "Hudson River Park",
    currentPlayers: 10,
    maxPlayers: 12,
    skillLevel: "Intermediate",
    hostName: "Carlos Rivera",
    hostRating: 4.5
  },
  {
    sport: "Basketball",
    title: "5v5 Challenge",
    time: new Date("2024-10-30T16:30:00"),
    location: "Brooklyn Bridge Park",
    currentPlayers: 8,
    maxPlayers: 10,
    skillLevel: "Advanced",
    hostName: "Maya Jones",
    hostRating: 4.7
  },
  {
    sport: "Soccer",
    title: "Pickup Game",
    time: new Date("2024-10-31T17:00:00"),
    location: "Prospect Park",
    currentPlayers: 12,
    maxPlayers: 14,
    skillLevel: "Beginner",
    hostName: "David Kim",
    hostRating: 4.3
  },
  {
    sport: "Basketball",
    title: "Casual Hoops",
    time: new Date("2024-10-28T15:00:00"),
    location: "Queensbridge Park",
    currentPlayers: 5,
    maxPlayers: 6,
    skillLevel: "Intermediate",
    hostName: "Nina Lee",
    hostRating: 4.8
  },
  {
    sport: "Tennis",
    title: "Singles Tournament",
    time: new Date("2024-10-26T09:30:00"),
    location: "Flushing Meadows",
    currentPlayers: 1,
    maxPlayers: 2,
    skillLevel: "Advanced",
    hostName: "Arthur Lin",
    hostRating: 4.6
  },
  {
    sport: "Volleyball",
    title: "Beach Volleyball Night",
    time: new Date("2024-11-01T20:00:00"),
    location: "Coney Island Beach",
    currentPlayers: 6,
    maxPlayers: 10,
    skillLevel: "Beginner",
    hostName: "Emma White",
    hostRating: 4.4
  },
  {
    sport: "Basketball",
    title: "Midweek Scrimmage",
    time: new Date("2024-10-30T19:30:00"),
    location: "Washington Square Park",
    currentPlayers: 6,
    maxPlayers: 8,
    skillLevel: "Intermediate",
    hostName: "Kevin Nguyen",
    hostRating: 4.7
  }
];






  return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="container">
          {/* <h1 className="welcome-heading">
            Welcome, {user?.displayName || 'User'}!
          </h1> */}
          <div className="games-grid">
            {/* {gameDataArray.map((game, index) => (
              <div key={index} className="game-card-wrapper">
                <GameCard game={game} />
              </div>
            ))} */}
            <GameCard game={gameData} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;