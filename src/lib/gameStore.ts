// Simple global game state (localStorage-based until Cloud is connected)

export interface PlayerData {
  nickname: string;
  coins: number;
  highScore: number;
  ownedSkins: string[];
  activeSkin: string;
  upgrades: { shield: number; speed: number; magnet: number };
}

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  arena: string;
}

const DEFAULT_PLAYER: PlayerData = {
  nickname: "Player",
  coins: 0,
  highScore: 0,
  ownedSkins: ["default"],
  activeSkin: "default",
  upgrades: { shield: 0, speed: 0, magnet: 0 },
};

export function getPlayer(): PlayerData {
  const raw = localStorage.getItem("pixel_runner_player");
  return raw ? { ...DEFAULT_PLAYER, ...JSON.parse(raw) } : { ...DEFAULT_PLAYER };
}

export function savePlayer(data: Partial<PlayerData>) {
  const current = getPlayer();
  localStorage.setItem("pixel_runner_player", JSON.stringify({ ...current, ...data }));
}

export function getLeaderboard(): LeaderboardEntry[] {
  const raw = localStorage.getItem("pixel_runner_leaderboard");
  return raw ? JSON.parse(raw) : [];
}

export function addToLeaderboard(entry: LeaderboardEntry) {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem("pixel_runner_leaderboard", JSON.stringify(board.slice(0, 50)));
}

export const SKINS = [
  { id: "default", name: "Runner", color: "#22c55e", price: 0 },
  { id: "fire", name: "Fire", color: "#ef4444", price: 100 },
  { id: "ice", name: "Ice", color: "#3b82f6", price: 100 },
  { id: "gold", name: "Gold", color: "#eab308", price: 250 },
  { id: "purple", name: "Shadow", color: "#a855f7", price: 250 },
  { id: "rainbow", name: "Rainbow", color: "#ec4899", price: 500 },
] as const;

export const ARENAS = [
  { id: "easy", name: "Зелёная долина", difficulty: "Лёгкая", obstacleSpeed: 4, spawnRate: 1800, color: "primary" },
  { id: "medium", name: "Пустыня", difficulty: "Средняя", obstacleSpeed: 6, spawnRate: 1400, color: "accent" },
  { id: "hard", name: "Вулкан", difficulty: "Сложная", obstacleSpeed: 8, spawnRate: 1000, color: "destructive" },
] as const;
