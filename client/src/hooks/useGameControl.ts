import React, { useEffect, useState } from "react";
import { binarySearch } from "../utils/binarySearch";
import { gameConfig, Beat } from "../gameConfig";

function getClosestIndex(sortedTs: number[], startTime: number) {
  const currentTime = new Date().getTime();
  const elapsed = currentTime - startTime;
  const closestIndex = binarySearch(sortedTs, elapsed, (mid, target) => {
    return Math.abs(target - sortedTs[mid]) <= gameConfig.tolerateDuration;
  });
  return closestIndex;
}

export const useGameControl = ({
  gameStartTimeRef,
  sortedTs,
  beats,
}: {
  gameStartTimeRef: React.MutableRefObject<number>;
  sortedTs: number[];
  beats: Beat[];
}) => {
  const [pressed, setPressed] = useState<"A" | "B" | null>(null);
  const [countHit, setCountHit] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const play = () => {
    setHasStarted(true);
  };

  const restart = () => {
    setHasEnded(false);
    setHasStarted(true);
    setCountHit(0);
  };

  const reset = () => {
    setHasEnded(false);
    setHasStarted(false);
    setCountHit(0);
  };

  const handleGameOver = () => {
    setHasEnded(true);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === " ") {
      setPressed("A");
      const closestIndex = getClosestIndex(sortedTs, gameStartTimeRef.current);
      if (
        closestIndex !== null &&
        !beats[closestIndex]?.hit &&
        beats[closestIndex].type === "A"
      ) {
        setCountHit(countHit + 1);
        beats[closestIndex].hit = true;
      }
    } else if (event.key === "o") {
      setPressed("B");
      const closestIndex = getClosestIndex(sortedTs, gameStartTimeRef.current);
      if (
        closestIndex !== null &&
        !beats[closestIndex]?.hit &&
        beats[closestIndex].type === "B"
      ) {
        setCountHit(countHit + 1);
        beats[closestIndex].hit = true;
      }
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    setPressed(null);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [countHit]);

  return {
    pressed,
    countHit,
    play,
    restart,
    reset,
    hasStarted,
    hasEnded,
    handleGameOver,
  };
};
