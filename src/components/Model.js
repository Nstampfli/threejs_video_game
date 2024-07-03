import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

function Model({ position, rotation, velocity, isJumping, isRunning }) {
  const { scene, animations } = useGLTF('/models/scene.gltf');
  const modelRef = useRef();
  const { actions, mixer } = useAnimations(animations, modelRef);
  const currentAction = useRef();

  useEffect(() => {
    currentAction.current = actions['Rig|idle'];
    if (currentAction.current) {
      currentAction.current.play();
    }
  }, [actions]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.position.set(position[0], position[1], position[2]);
      modelRef.current.rotation.y = rotation.current;

      let newAction;
      if (isJumping.current) {
        newAction = actions['Rig|jump'];
      } else if (isRunning.current) {
        newAction = actions['Rig|run'];
      } else if (velocity[0] !== 0 || velocity[2] !== 0) {
        newAction = actions['Rig|walk'];
      } else {
        newAction = actions['Rig|idle'];
      }

      if (currentAction.current !== newAction) {
        if (currentAction.current) {
          currentAction.current.fadeOut(0.2);
        }
        newAction.reset().fadeIn(0.2).play();
        currentAction.current = newAction;
      }

      // Synchroniser la vitesse de l'animation avec la vitesse de course
      if (isRunning.current && currentAction.current === actions['Rig|run']) {
        currentAction.current.timeScale = 2.0; // Accélère l'animation pour correspondre à la vitesse de course
      } else {
        currentAction.current.timeScale = 1.0; // Réinitialiser la vitesse de l'animation
      }

      mixer.update(0.01);
    }
  });

  return <primitive object={scene} ref={modelRef} />;
}

export default Model;
