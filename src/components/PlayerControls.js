import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Model from './Model';
import useKeyboardControls from '../hooks/useKeyboardControls';
import useCollisionDetection from '../hooks/useCollisionDetection';

function PlayerControls({ position, rotation }) {
  const velocity = useRef([0, 0, 0]);
  const direction = useRef(new THREE.Vector3());
  const isJumping = useRef(false);
  const isRunning = useRef(false);
  const speedMultiplier = useRef(1);

  const { camera } = useThree();

  useKeyboardControls(velocity, isJumping, isRunning, speedMultiplier);
  useCollisionDetection(position, velocity, isJumping);

  useFrame(() => {
    camera.getWorldDirection(direction.current);
    direction.current.y = 0;
    direction.current.normalize();

    const moveX = velocity.current[0];
    const moveZ = velocity.current[2];

    const forward = new THREE.Vector3(direction.current.x, 0, direction.current.z).multiplyScalar(moveZ);
    const sideways = new THREE.Vector3(direction.current.z, 0, -direction.current.x).multiplyScalar(moveX);

    const move = forward.add(sideways);

    position.current[0] += move.x;
    position.current[2] += move.z;

    if (move.lengthSq() > 0) {
      const angle = Math.atan2(move.x, move.z);
      rotation.current = angle;
    }
  });

  return <Model position={position.current} rotation={rotation} velocity={velocity.current} isJumping={isJumping} isRunning={isRunning} />;
}

export default PlayerControls;
