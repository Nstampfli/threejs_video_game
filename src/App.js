import React, { useEffect, useRef, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, useProgress } from '@react-three/drei';
import CameraController from './components/CameraController';
import Environment from './components/Environment';
import PlayerControls from './components/PlayerControls';
import ControlsTutorial from './components/ControlsTutorial';
import Loader from './components/Loader';

function LoaderWrapper() {
  const { progress } = useProgress();
  return <Loader progress={progress} />;
}

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
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

  function handleProgress(progress) {
    if (progress === 100) {
      setTimeout(() => {
        setLoadingComplete(true);
      }, 500); // Optional delay for smoother transition
    }
  }

  return (
    <Suspense fallback={<LoaderWrapper onProgress={handleProgress} />}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment />
        <PlayerControls position={position} rotation={rotation} />
        <CameraController target={position} />
      </Canvas>
      <ControlsTutorial />
    </Suspense>
  );
}

export default App;
