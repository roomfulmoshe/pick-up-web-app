import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

// Calculate distance using Haversine formula (miles)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Filter games by sports
const filterGamesBySports = (games, sportsArray) => {
  if (!sportsArray || sportsArray.length === 0) return games;
  return games.filter(game => sportsArray.includes(game.sport.toLowerCase()));
};

// Filter games by distance
const filterGamesByDistance = (games, userLat, userLon, maxDistanceMiles) => {
  if (!userLat || !userLon || !maxDistanceMiles) return games;
  
  return games.filter(game => {
    const gameLat = game.location.latitude;
    const gameLon = game.location.longitude;
    const distance = calculateDistance(userLat, userLon, gameLat, gameLon);
    return distance <= maxDistanceMiles;
  });
};

// Filter games by skill level
const filterGamesBySkillLevel = (games, skillLevel) => {
  if (!skillLevel) return games;
  return games.filter(game => game.skillLevel === skillLevel);
};

// Main filter function that combines all filters
export const filterGames = (games, filters) => {
  let filteredGames = [...games];

  // Apply sports filter
  if (filters.sports?.length > 0) {
    filteredGames = filterGamesBySports(filteredGames, filters.sports);
  }

  // Apply distance filter
  if (filters.location && filters.maxDistance) {
    filteredGames = filterGamesByDistance(
      filteredGames,
      filters.location.latitude,
      filters.location.longitude,
      filters.maxDistance
    );
  }

  // Apply skill level filter
  if (filters.skillLevel) {
    filteredGames = filterGamesBySkillLevel(filteredGames, filters.skillLevel);
  }

  return filteredGames;
};

// Additional helper functions as needed
export const getUniqueGameSports = (games) => {
  return [...new Set(games.map(game => game.sport))];
};

export const getSkillLevels = () => {
  return ['beginner', 'intermediate', 'advanced'];
};