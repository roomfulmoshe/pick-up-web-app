// GameSwiper.jsx (Parent Component)
import React, { useState } from 'react';
import GameCard from './GameCard';

const GameSwiper = ({ gamesData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === gamesData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    // Add any dislike logic here
    handleNext();
  };

  const handleReserve = (e) => {
    e.stopPropagation();
    // Add reservation logic here
    handleNext();
  };

  return (
    <div className="game-swiper">
      <GameCard 
        game={gamesData[currentIndex]} 
        onDislike={handleDislike}
        onReserve={handleReserve}
      />
    </div>
  );
};

export default GameSwiper;