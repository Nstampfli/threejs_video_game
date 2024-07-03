import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraController from './components/CameraController';
import Environment from './components/Environment';
import PlayerControls from './components/PlayerControls';
import ControlsTutorial from './components/ControlsTutorial';

function App() {
  const position = useRef([0, -25, 0]);
  const rotation = useRef(0);

  useEffect(() => {
    const handleClick = () => {
      document.body.requestPointerLock();
      if (document.fullscreenElement === null) {
        document.documentElement.requestFullscreen();
      }
    };

    document.body.addEventListener('click', handleClick);

    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={null}>
          <Environment />
          <PlayerControls position={position} rotation={rotation} />
        </Suspense>
        <CameraController target={position} />
      </Canvas>
      <ControlsTutorial />
    </>
  );
}

export default App;
