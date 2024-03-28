export const gameConfig = {
  showUpDuration: 2000, // how many second the dot will show up before the hitting timing
  tolerateDuration: 200, // how many second the dot will tolerate before or after the hitting timing
  gameOverDuration: 4000, // how many second the game will show the game over screen
} as const;

export type Beat = {
  type: "A" | "B";
  ts: number;
  hit?: boolean;
};

export const yellowBeats: Beat[] = [
  {
    type: "A",
    ts: 13368,
  },
  {
    type: "B",
    ts: 14074,
  },
  {
    type: "A",
    ts: 14682,
  },
  {
    type: "A",
    ts: 15041,
  },
  {
    type: "B",
    ts: 15491,
  },
  {
    type: "A",
    ts: 16156,
  },
  {
    type: "B",
    ts: 16853,
  },
  {
    type: "A",
    ts: 17529,
  },
  {
    type: "A",
    ts: 17888,
  },
  {
    type: "B",
    ts: 18248,
  },
  {
    type: "A",
    ts: 18923,
  },
  {
    type: "B",
    ts: 19643,
  },
  {
    type: "A",
    ts: 20331,
  },
  {
    type: "A",
    ts: 20667,
  },
  {
    type: "B",
    ts: 21026,
  },
  {
    type: "A",
    ts: 21701,
  },
  {
    type: "B",
    ts: 22354,
  },
  {
    type: "A",
    ts: 23053,
  },
  {
    type: "A",
    ts: 23448,
  },
  {
    type: "B",
    ts: 23761,
  },
  {
    type: "A",
    ts: 24436,
  },
  {
    type: "B",
    ts: 25145,
  },
  {
    type: "A",
    ts: 25876,
  },
  {
    type: "A",
    ts: 26213,
  },
  {
    type: "B",
    ts: 26551,
  },
  {
    type: "A",
    ts: 27205,
  },
  {
    type: "B",
    ts: 27856,
  },
  {
    type: "A",
    ts: 28577,
  },
  {
    type: "A",
    ts: 28902,
  },
  {
    type: "B",
    ts: 29274,
  },
  {
    type: "A",
    ts: 30027,
  },
  {
    type: "B",
    ts: 30658,
  },
  {
    type: "A",
    ts: 31389,
  },
  {
    type: "A",
    ts: 31704,
  },
  {
    type: "B",
    ts: 32043,
  },
  {
    type: "A",
    ts: 32763,
  },
  {
    type: "B",
    ts: 33425,
  },
  {
    type: "A",
    ts: 34158,
  },
  {
    type: "A",
    ts: 34473,
  },
  {
    type: "B",
    ts: 34855,
  },
];

const genBeatMap = (beats: Beat[]) => {
  return beats.reduce((acc, beat) => {
    acc[beat.ts] = beat;
    return acc;
  }, {} as Record<number, Beat>);
};

export const yellowBeatMap = genBeatMap(yellowBeats);
