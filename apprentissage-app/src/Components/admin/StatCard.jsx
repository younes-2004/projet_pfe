import React from 'react';

const StatCard = ({ title, value, color, subtitle = null }) => {
  return (
    <div className={`card text-white bg-${color}`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h2 className="card-text">{value}</h2>
        {subtitle && <p className="card-text small">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;