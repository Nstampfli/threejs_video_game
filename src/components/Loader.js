import React from 'react';
import './Loader.css';

const Loader = ({ progress }) => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
      <div className="loader-text">{progress.toFixed(0)}%</div>
    </div>
  );
};

export default Loader;
