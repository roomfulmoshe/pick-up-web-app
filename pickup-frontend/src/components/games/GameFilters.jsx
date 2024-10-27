import React, { useState } from 'react';
import '../../styles/Filters.css';

const GameFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    topRated: false,
    sport: '',
    distance: 10
  });

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <h3 className="filter-title">Filters</h3>
        
        {/* Top Rated Toggle */}
        <div className="filter-item">
          <label className="toggle-container">
            <span className="toggle-label">Top Rated Hosts</span>
            <input
              type="checkbox"
              checked={filters.topRated}
              onChange={(e) => handleFilterChange('topRated', e.target.checked)}
              className="toggle-input"
            />
            <span className="toggle-switch"></span>
          </label>
        </div>

        {/* Sport Select */}
        <div className="filter-item">
          <label className="select-label">Sport</label>
          <div className="custom-select">
            <select
              value={filters.sport}
              onChange={(e) => handleFilterChange('sport', e.target.value)}
              className="select-input"
            >
              <option value="">All Sports</option>
              <option value="basketball">Basketball</option>
              <option value="soccer">Soccer</option>
              <option value="tennis">Tennis</option>
              <option value="volleyball">Volleyball</option>
              <option value="baseball">Baseball</option>
              <option value="badminton">Badminton</option>
            </select>
          </div>
        </div>

        {/* Distance Range */}
        <div className="filter-item">
          <label className="range-label">
            <span>Distance</span>
            <span className="range-value">{filters.distance} miles</span>
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={filters.distance}
            onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
            className="range-input"
          />
          <div className="range-marks">
            <span>1</span>
            <span>25</span>
            <span>50</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameFilters;