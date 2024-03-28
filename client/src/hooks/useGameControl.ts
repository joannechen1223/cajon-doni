import React, { useCallback, useState } from "react";
import { binarySearch } from "../utils/binarySearch";
import { gameConfig, Beat } from "../gameConfig";
import useWebSocket from "react-use-websocket";

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

  const { readyState } = useWebSocket("ws://100.110.142.168:8000", {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    onMessage: (message) => {
      console.log("msg: ", message.data);
      const data = JSON.parse(message.data);
      console.log(data);
      if (data.sensor === 1) {
        handleKeyDown(1);
      } else {
        handleKeyDown(2);
      }
      setTimeout(() => {
        setPressed(null);
      }, 50);
    },
    onError: (error) => {
      console.log("error: ", error);
    },
    share: true,
    filter: () => true,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  const play = () => {
    setHasStarted(true);
    // update GameStartTime
    gameStartTimeRef.current = new Date().getTime();
  };

  const restart = () => {
    setHasEnded(false);
    setHasStarted(true);
    setCountHit(0);
    // update gameStartTime
    gameStartTimeRef.current = new Date().getTime();
  };

  const reset = () => {
    setHasEnded(false);
    setHasStarted(false);
    setCountHit(0);
  };

  const handleGameOver = () => {
    setHasEnded(true);
  };

  const handleKeyDown = useCallback(
    (key: 1 | 2) => {
      if (key === 1) {
        setPressed("A");
        const closestIndex = getClosestIndex(
          sortedTs,
          gameStartTimeRef.current
        );
        if (
          closestIndex !== null &&
          !beats[closestIndex]?.hit &&
          beats[closestIndex].type === "A"
        ) {
          setCountHit((count) => count + 1);
          beats[closestIndex].hit = true;
        }
      } else if (key === 2) {
        setPressed("B");
        const closestIndex = getClosestIndex(
          sortedTs,
          gameStartTimeRef.current
        );
        if (
          closestIndex !== null &&
          !beats[closestIndex]?.hit &&
          beats[closestIndex].type === "B"
        ) {
          setCountHit((count) => count + 1);
          beats[closestIndex].hit = true;
        }
      }
    },
    [countHit]
  );

  // const handleKeyUp = (event: KeyboardEvent) => {
  //   setPressed(null);
  // };

  // useEffect(() => {
  //   window.addEventListener("keydown", handleKeyDown);
  //   window.addEventListener("keyup", handleKeyUp);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //     window.removeEventListener("keyup", handleKeyUp);
  //   };
  // }, [countHit]);

  return {
    pressed,
    countHit,
    play,
    restart,
    reset,
    hasStarted,
    hasEnded,
    handleGameOver,
    wsReadyState: readyState,
  };
};
