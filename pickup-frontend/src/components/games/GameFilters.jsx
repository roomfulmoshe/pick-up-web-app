import '../../styles/Filters.css';
// GameFilters.jsx
import React, { useState } from 'react';

const SPORTS = [
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'soccer', name: 'Soccer', icon: '⚽' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'baseball', name: 'Baseball', icon: '⚾' },
  { id: 'football', name: 'Football', icon: '🏈' }
];

const GameFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    sports: [], // Changed from single sport to array of sports
    distance: 50
  });

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSportSelect = (sportId) => {
    let newSports;
    if (filters.sports.includes(sportId)) {
      // Remove sport if already selected
      newSports = filters.sports.filter(sport => sport !== sportId);
    } else {
      // Add sport if not selected
      newSports = [...filters.sports, sportId];
    }
    handleFilterChange('sports', newSports);
  };

  const clearSports = () => {
    handleFilterChange('sports', []);
  };

  return (
    <div className="filters-container">
      <div className="filter-header">
        <h3 className="filter-title">Find Your Game</h3>
        {filters.sports.length > 0 && (
          <button 
            className="clear-filters"
            onClick={clearSports}
          >
            Clear Sports ({filters.sports.length})
          </button>
        )}
      </div>
      
      {/* Sports Selection */}
      <div className="sports-grid">
        {SPORTS.map(sport => (
          <button
            key={sport.id}
            type="button"
            className={`sport-button ${filters.sports.includes(sport.id) ? 'selected' : ''}`}
            onClick={() => handleSportSelect(sport.id)}
          >
            <span className="sport-icon">{sport.icon}</span>
            <span className="sport-name">{sport.name}</span>
          </button>
        ))}
      </div>

      {/* Distance Control */}
      <div className="distance-control">
        <div className="distance-header">
          <span className="distance-label">Distance</span>
          <span className="distance-value">{filters.distance} miles</span>
        </div>
        
        <input
          type="range"
          min="1"
          max="50"
          value={filters.distance}
          onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
          className="distance-slider"
        />
        
        <div className="distance-marks">
          <span className="distance-mark">1</span>
          <span className="distance-mark">25</span>
          <span className="distance-mark">50</span>
        </div>
      </div>
    </div>
  );
};

export default GameFilters;