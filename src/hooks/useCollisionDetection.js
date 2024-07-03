import { useEffect } from 'react';
import { BOX_SIZE } from '../utils/constants';

const useCollisionDetection = (position, velocity, isJumping) => {
  useEffect(() => {
    const handleCollision = () => {
      // Détection de collision avec les murs de la box avec une marge de 0.5 pour éviter d'être dans le mur
      const margin = 0.5;
      if (position.current[0] > BOX_SIZE - margin) position.current[0] = BOX_SIZE - margin;
      if (position.current[0] < -BOX_SIZE + margin) position.current[0] = -BOX_SIZE + margin;
      if (position.current[2] > BOX_SIZE - margin) position.current[2] = BOX_SIZE - margin;
      if (position.current[2] < -BOX_SIZE + margin) position.current[2] = -BOX_SIZE + margin;

      // Appliquer la gravité
      velocity.current[1] -= 0.01;
      position.current[1] += velocity.current[1];

      if (position.current[1] < -BOX_SIZE) {
        position.current[1] = -BOX_SIZE;
        velocity.current[1] = 0;
        isJumping.current = false;
      }
    };

    const interval = setInterval(handleCollision, 10);

    return () => clearInterval(interval);
  }, [position, velocity, isJumping]);
};

export default useCollisionDetection;
