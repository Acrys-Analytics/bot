export type Mastery = {
  id: number;
  championId: number;
  championName: string;
  level: number;
  points: number;
  summonerSnapshotId: number;
};

export type Participant = {
  id: number;
  summonerId: string;
  championId: number;
  championName: string;
  championLevel: number;
  position: Position;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  creepScore: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  gold: number;
  damageToChamps: number;
  damageToBuildings: number;
  spells: number[];
  runes: number[];
  items: number[];
  matchId: string;
};

export type Match = {
  id: string;
  createdAt: Date;
  duration: number;
  type: string;
  version: string;
  mapId: number;
};

export type SummonerSnapshot = {
  id: number;
  puuid: string;
  summonerId: string;
  summonerIconId: number;
  summonerName: string;
  summonerLevel: number;
  clashPosition: Position | null;
  tier: Tier | null;
  rank: Rank | null;
  analyticsQueryId: string;
};

export type AnalyticsQuery = {
  id: string;
  createdAt: Date;
  complete: boolean;
  error: string | null;
  depth: number;
  region: string;
  type: QueryType;
  search: string;
};

export const Position = {
  TOP: "TOP",
  JUNGLE: "JUNGLE",
  MIDDLE: "MIDDLE",
  BOTTOM: "BOTTOM",
  UTILITY: "UTILITY",
  FILL: "FILL",
};

export type Position = typeof Position[keyof typeof Position];

export const Tier = {
  IRON: "IRON",
  BRONZE: "BRONZE",
  SILVER: "SILVER",
  GOLD: "GOLD",
  PLATINUM: "PLATINUM",
  DIAMOND: "DIAMOND",
  MASTER: "MASTER",
  GRANDMASTER: "GRANDMASTER",
  CHALLENGER: "CHALLENGER",
};

export type Tier = typeof Tier[keyof typeof Tier];

export const Rank = {
  IV: "IV",
  III: "III",
  II: "II",
  I: "I",
};

export type Rank = typeof Rank[keyof typeof Rank];

export const QueryType = {
  PLAYER: "PLAYER",
  CLASH: "CLASH",
};

export type QueryType = typeof QueryType[keyof typeof QueryType];
