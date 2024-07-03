import { useEffect } from 'react';

const useKeyboardControls = (velocity, isJumping, isRunning, speedMultiplier) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      switch (key) {
        case 'z':
          velocity.current[2] = 0.15 * speedMultiplier.current;
          break;
        case 's':
          velocity.current[2] = -0.15 * speedMultiplier.current;
          break;
        case 'q':
          velocity.current[0] = 0.15 * speedMultiplier.current;
          break;
        case 'd':
          velocity.current[0] = -0.15 * speedMultiplier.current;
          break;
        case ' ':
          if (!isJumping.current) {
            velocity.current[1] = 0.2;
            isJumping.current = true;
          }
          break;
        case 'Shift':
          isRunning.current = true;
          speedMultiplier.current = 2;
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
        case 'Shift':
          isRunning.current = false;
          speedMultiplier.current = 1;
          if (!velocity.current[2] && !velocity.current[0]) {
            // If no movement keys are pressed, stop movement
            velocity.current[0] = 0;
            velocity.current[2] = 0;
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [velocity, isJumping, isRunning, speedMultiplier]);
};

export default useKeyboardControls;
