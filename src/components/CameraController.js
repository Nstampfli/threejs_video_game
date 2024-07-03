import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

function CameraController({ target }) {
  const controlsRef = useRef();
  const { camera } = useThree();
  const rotation = useRef([0, 0]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { movementX, movementY } = event;
      rotation.current[0] -= movementX * 0.002;
      rotation.current[1] -= movementY * 0.002;
      rotation.current[1] = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.current[1])); // Limite la rotation verticale
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame(() => {
    const offset = new THREE.Vector3(0, 2, -3).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current[0]); // Ajuster cette ligne pour rapprocher la caméra
    offset.y += rotation.current[1];
    const cameraPosition = new THREE.Vector3(target.current[0], target.current[1], target.current[2]).add(offset);

    camera.position.lerp(cameraPosition, 0.1);
    camera.lookAt(target.current[0], target.current[1] + 2, target.current[2]); // Ajuste la hauteur pour regarder le personnage
  });

  return <PointerLockControls ref={controlsRef} />;
}

export default CameraController;
