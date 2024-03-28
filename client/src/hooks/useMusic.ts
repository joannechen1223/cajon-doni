import { yellowBeatMap, yellowBeats } from "../gameConfig";

export function useMusic() {
  const sortedTs: number[] = Object.keys(yellowBeatMap)
    .map((k) => parseInt(k))
    .sort((a, b) => a - b);

  return {
    sortedTs,
    beats: yellowBeats,
    beatMap: yellowBeatMap,
  };
}
