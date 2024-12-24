import { useState, useRef, useEffect } from "react";

export function useGameTimer(initialTime = 0) {
  const [time, setTime] = useState(initialTime);
  const timerRef = useRef(null);

  const startTimer = (startTime = Date.now()) => {
    if (timerRef.current) return; // Prevent multiple timers
    const elapsedTime = Date.now() - startTime;
    setTime(elapsedTime / 10); // Initialize with elapsed time
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 10);
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  useEffect(() => {
    return () => stopTimer(); // Clean up timer on unmount
  }, []);

  return { time, startTimer, stopTimer, resetTimer };
}