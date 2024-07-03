import React from 'react';

function Obstacle({ position, size }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default Obstacle;
