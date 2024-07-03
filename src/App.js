import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Modèle du personnage avec animations
function Model({ position, rotation, velocity, isJumping }) {
  const { scene, animations } = useGLTF('/models/scene.gltf');
  const modelRef = useRef();
  const { actions, mixer } = useAnimations(animations, modelRef);
  const currentAction = useRef();

  useEffect(() => {
    // Initial animation
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

      mixer.update(0.01);
    }
  });

  return <primitive object={scene} ref={modelRef} />;
}

// Cube d'environnement
function Box() {
  return (
    <mesh>
      <boxGeometry args={[50, 50, 50]} />
      <meshStandardMaterial color="skyblue" side={THREE.BackSide} />
    </mesh>
  );
}

// Contrôleur de caméra
function CameraController({ target }) {
  const controlsRef = useRef();

  useFrame(({ camera }) => {
    const offset = new THREE.Vector3(0, 2, -5);
    const cameraPosition = new THREE.Vector3(target.current[0], target.current[1], target.current[2]).add(offset);

    camera.position.lerp(cameraPosition, 0.1);
    camera.lookAt(target.current[0], target.current[1], target.current[2]);
  });

  return <PointerLockControls ref={controlsRef} />;
}

// Contrôleur du joueur
function PlayerControls({ position, rotation }) {
  const velocity = useRef([0, 0, 0]);
  const direction = useRef(new THREE.Vector3());
  const isJumping = useRef(false);
  const gravity = useRef(0.01);

  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      switch (key) {
        case 'z':
          velocity.current[2] = 0.1;  // Avant
          break;
        case 's':
          velocity.current[2] = -0.1; // Arrière
          break;
        case 'q':
          velocity.current[0] = 0.1;  // Gauche
          break;
        case 'd':
          velocity.current[0] = -0.1; // Droite
          break;
        case ' ':
          if (!isJumping.current) {
            velocity.current[1] = 0.2;  // Saut
            isJumping.current = true;
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      const { key } = event;
      switch (key) {
        case 'z':
        case 's':
          velocity.current[2] = 0;
          break;
        case 'q':
        case 'd':
          velocity.current[0] = 0;
          break;
        default:
          break;
      }
    };

    const handleMouseMove = (event) => {
      const { movementX } = event;
      rotation.current -= movementX * 0.002;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [rotation]);

  useFrame(() => {
    camera.getWorldDirection(direction.current);
    direction.current.y = 0; // Ne pas tenir compte de l'inclinaison verticale
    direction.current.normalize();

    const moveX = velocity.current[0];
    const moveZ = velocity.current[2];

    // Appliquer la direction de la caméra pour les déplacements
    const forward = new THREE.Vector3(direction.current.x, 0, direction.current.z).multiplyScalar(moveZ);
    const sideways = new THREE.Vector3(direction.current.z, 0, -direction.current.x).multiplyScalar(moveX);

    const move = forward.add(sideways);

    position.current[0] += move.x;
    position.current[2] += move.z;

    if (move.lengthSq() > 0) {
      const angle = Math.atan2(move.x, move.z);
      rotation.current = angle;
    }

    // Appliquer la gravité
    velocity.current[1] -= gravity.current;

    // Mettre à jour la position verticale
    position.current[1] += velocity.current[1];

    // Vérifier si le joueur est au sol
    if (position.current[1] < -25) {
      position.current[1] = -25;
      velocity.current[1] = 0;
      isJumping.current = false;
    }
  });

  return <Model position={position.current} rotation={rotation} velocity={velocity.current} isJumping={isJumping} />;
}

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
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Suspense fallback={null}>
        <Box />
        <PlayerControls position={position} rotation={rotation} />
      </Suspense>
      <CameraController target={position} />
    </Canvas>
  );
}

export default App;

