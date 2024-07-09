import React from 'react';

const ClubCard = ({ name, logo, className, onClick }) => {
  return (
    <div onClick={onClick} className={`bg-white rounded-lg shadow-md p-6 text-center border border-transparent transition-all duration-300 ${className}`}>
      <img src={logo} alt={`${name} logo`} className="w-24 h-24 mx-auto mb-4" />
      <h3 className="text-xl font-semibold">{name}</h3>
    </div>
  );
};

export default ClubCard;