import React from 'react';
import * as THREE from 'three';

function Environment() {
  return (
    <mesh>
      <boxGeometry args={[50, 50, 50]} />
      <meshStandardMaterial color="skyblue" side={THREE.BackSide} />
    </mesh>
  );
}

export default Environment;
