import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import '../styles/homePage.css';
import GameSwiper from './games/GameSwiper';
import GameFilters from './games/GameFilters';


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









const gamesData = [
  {
    sport: "basketball",
    title: "Sunday Morning 3v3",
    description: "Competitive 3v3 basketball games. Full court available with proper rotation of teams. Winners stay on court. Looking for consistent players for weekly games.",
    schedule: {
      startTime: new Date("2024-10-27T10:00:00"),
      endTime: new Date("2024-10-27T12:00:00"),
      isRecurring: false
    },
    location: {
      address: "8 Cornwall Ct, East Brunswick, NJ 08816",
      latitude: 40.7128,
      longitude: -74.006,
      locationType: "indoor",
      venue: "Brunswick Community Center",
      coordinates: { latitude: 40.7128, longitude: -74.006 }
    },
    currentPlayers: 4,
    maxPlayers: 6,
    minPlayers: 6,
    photoURL: "",
    skillLevel: "intermediate",
    hostName: "Loan Smith",
    hostRating: 4.8,
    autoJoin: true,
    equipment: "Basketball (provided)",
    fee: 5,
    hostId: "dVX6Rs4butejkUBenRMXm8BcFW92",
    status: "active",
    createdAt: new Date("2024-10-20T10:00:00"),
    updatedAt: new Date("2024-10-20T10:00:00")
  },
  {
    sport: "tennis",
    title: "Tennis Singles/Doubles Mixer",
    description: "Casual tennis matches with rotating partners. All skill levels welcome. We'll organize both singles and doubles matches based on attendance.",
    schedule: {
      startTime: new Date("2024-10-28T17:30:00"),
      endTime: new Date("2024-10-28T19:30:00"),
      isRecurring: false
    },
    location: {
      address: "123 Tennis Court Lane, Princeton, NJ 08544",
      latitude: 40.3573,
      longitude: -74.6672,
      locationType: "outdoor",
      venue: "Princeton Tennis Club",
      coordinates: { latitude: 40.3573, longitude: -74.6672 }
    },
    currentPlayers: 3,
    maxPlayers: 8,
    minPlayers: 4,
    photoURL: "https://media.giphy.com/media/3o7aD3JtKXHaFN81dC/giphy.gif",
    skillLevel: "beginner",
    hostName: "Maria Chen",
    hostRating: 4.9,
    autoJoin: false,
    equipment: "Tennis racket required, balls provided",
    fee: 0,
    hostId: "kL9mNp4RqTyUvWxYzA3H",
    status: "active",
    createdAt: new Date("2024-10-21T15:00:00"),
    updatedAt: new Date("2024-10-21T15:00:00")
  },
  {
    sport: "soccer",
    title: "Friday Night Futsal",
    description: "Indoor 5v5 futsal games. Fast-paced matches with 10-minute rotations. Indoor shoes required. No cleats allowed.",
    schedule: {
      startTime: new Date("2024-10-29T19:00:00"),
      endTime: new Date("2024-10-29T21:00:00"),
      isRecurring: false
    },
    location: {
      address: "456 Indoor Sports Way, Edison, NJ 08817",
      latitude: 40.5187,
      longitude: -74.4120,
      locationType: "indoor",
      venue: "Edison Futsal Center",
      coordinates: { latitude: 40.5187, longitude: -74.4120 }
    },
    currentPlayers: 6,
    maxPlayers: 10,
    minPlayers: 6,
    photoURL: "https://media.giphy.com/media/3o7aDbJJV5n7Y6KgkU/giphy.gif",
    skillLevel: "advanced",
    hostName: "Carlos Rodriguez",
    hostRating: 4.7,
    autoJoin: true,
    equipment: "Indoor soccer shoes required",
    fee: 10,
    hostId: "bC5vF2sK8mPqNxL4tE7R",
    status: "active",
    createdAt: new Date("2024-10-22T12:00:00"),
    updatedAt: new Date("2024-10-22T12:00:00")
  },
  {
    sport: "volleyball",
    title: "Beach Volleyball Sunday",
    description: "6v6 beach volleyball games. Rotating teams every set. Please arrive 15 minutes early for warm-up.",
    schedule: {
      startTime: new Date("2024-10-30T15:00:00"),
      endTime: new Date("2024-10-30T18:00:00"),
      isRecurring: false
    },
    location: {
      address: "789 Beach Road, Point Pleasant, NJ 08742",
      latitude: 40.0583,
      longitude: -74.0431,
      locationType: "outdoor",
      venue: "Point Pleasant Beach Courts",
      coordinates: { latitude: 40.0583, longitude: -74.0431 }
    },
    currentPlayers: 8,
    maxPlayers: 12,
    minPlayers: 6,
    photoURL: "https://media.giphy.com/media/3o7aD3JtKXHaFN81dC/giphy.gif",
    skillLevel: "intermediate",
    hostName: "Sarah Johnson",
    hostRating: 4.6,
    autoJoin: true,
    equipment: "Volleyball provided",
    fee: 0,
    hostId: "mR7tH9wQ4yZxC2vN5pL",
    status: "active",
    createdAt: new Date("2024-10-23T09:00:00"),
    updatedAt: new Date("2024-10-23T09:00:00")
  },
  {
    sport: "badminton",
    title: "Morning Badminton Session",
    description: "Mixed doubles and singles matches. All levels welcome. We'll rotate partners throughout the session.",
    schedule: {
      startTime: new Date("2024-10-31T07:00:00"),
      endTime: new Date("2024-10-31T09:00:00"),
      isRecurring: false
    },
    location: {
      address: "321 Sports Center Drive, Somerset, NJ 08873",
      latitude: 40.4862,
      longitude: -74.5532,
      locationType: "indoor",
      venue: "Somerset Badminton Club",
      coordinates: { latitude: 40.4862, longitude: -74.5532 }
    },
    currentPlayers: 5,
    maxPlayers: 8,
    minPlayers: 4,
    photoURL: "https://media.giphy.com/media/3o7aD3JtKXHaFN81dC/giphy.gif",
    skillLevel: "beginner",
    hostName: "David Lee",
    hostRating: 4.9,
    autoJoin: false,
    equipment: "Rackets available for rent ($5)",
    fee: 15,
    hostId: "pL5kM2nB9cX4vR7tY6",
    status: "active",
    createdAt: new Date("2024-10-24T08:00:00"),
    updatedAt: new Date("2024-10-24T08:00:00")
  }
];
















  const gameData = {
  sport: "basketball",
  title: "Sunday Morning 3v3",
  schedule: {
    startTime: new Date("2024-10-27T10:00:00")
  },
  location: {
    address: "8 Cornwall Ct, East Brunswick, NJ 08816",
    latitude: 40.7128,
    longitude: -74.006,
    locationType: "outdoor",
    venue: "The Fields Sports Complex"
  },
  currentPlayers: 4,
  maxPlayers: 6,
  minPlayers: 2,
  photoURL: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWVpZjhiYmp2ODB3ZDZoM2hnenIxYzRhZWQyMTA3M2Fua2p5Nzg1bSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o6ZtmDAQdrDfaTWEw/giphy.gif",
  skillLevel: "intermediate",
  hostName: "Loan Smith",
  hostRating: 4.8,
  autoJoin: true,
  description: "Game Type: Singles and Doubles matches Duration: Each match is best of three sets, with a tie-break at 6-6. Basic Rules: Matches start with a coin toss to determine the first server. Each player must win by two points during the tie-break. Substitutions: Not applicable as tennis does not allow player substitutions during a match. Scoring: Points are scored in sequences of 15, 30, 40, and Game. First player to win six games with a two-game advantage wins the set.",
  equipment : "Tennis Racket",
  fee: 5,
  hostId: "dVX6Rs4butejkUBenRMXm8BcFW92",
  status:"active",
  updatedAt: new Date("2024-10-27T10:00:00")
};





return (
    <div className="page-container">
      <Navbar />
      <main className="main-content">
        <div className="container">
          <div className="games-grid">
            <GameFilters />
            <div className="game-swiper-wrapper">
              <GameSwiper gamesData={gamesData} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default HomePage;