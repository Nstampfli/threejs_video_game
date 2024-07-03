import React, { useEffect, useState } from 'react';
import './ControlsTutorial.css';

const ControlsTutorial = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`controls-tutorial ${visible ? 'visible' : 'hidden'}`}>
      <div className="controls-tutorial-row">
        <div className="controls-tutorial-item">
          <div className="key">Z</div>
          <div className="description">Avancer</div>
        </div>
        <div className="controls-tutorial-item">
          <div className="key">Q</div>
          <div className="description">Gauche</div>
        </div>
        <div className="controls-tutorial-item">
          <div className="key">S</div>
          <div className="description">Reculer</div>
        </div>
        <div className="controls-tutorial-item">
          <div className="key">D</div>
          <div className="description">Droite</div>
        </div>
      </div>
      <div className="controls-tutorial-row">
        <div className="controls-tutorial-item">
          <div className="key">Espace</div>
          <div className="description">Sauter</div>
        </div>
        <div className="controls-tutorial-item">
          <div className="key">Shift</div>
          <div className="description">Courir</div>
        </div>
      </div>
    </div>
  );
};

export default ControlsTutorial;
