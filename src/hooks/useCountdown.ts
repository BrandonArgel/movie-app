import { useEffect, useState } from 'react';

const useCountdown = (seconds: number) => {
  const [countdown, setCountdown] = useState(seconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return [countdown, setIsRunning] as const;
}

export { useCountdown };