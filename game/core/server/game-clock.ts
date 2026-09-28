export type GameSpeed = 0 | 1 | 2 | 4;

export interface GameClockState {
  day: number;
  hour: number;
  minute: number;
  speed: GameSpeed;
  paused: boolean;
  updatedAt: number;
}

const HOUR_MS = 4000;
let state: GameClockState = { day: 1, hour: 8, minute: 0, speed: 1, paused: false, updatedAt: Date.now() };

function advance(now: number) {
  if (state.paused || state.speed === 0) { state.updatedAt = now; return; }
  const elapsed = Math.max(0, now - state.updatedAt);
  const gameMinutes = Math.floor((elapsed / HOUR_MS) * 60 * state.speed);
  if (gameMinutes <= 0) return;
  const total = (state.day - 1) * 1440 + state.hour * 60 + state.minute + gameMinutes;
  state.day = Math.floor(total / 1440) + 1;
  const minuteOfDay = total % 1440;
  state.hour = Math.floor(minuteOfDay / 60);
  state.minute = minuteOfDay % 60;
  state.updatedAt = now;
}
export function getGameClock(): GameClockState { advance(Date.now()); return { ...state }; }

export function setGameClock(patch: Partial<Pick<GameClockState, "speed" | "paused">>): GameClockState {
  advance(Date.now());
  if (patch.speed !== undefined) state.speed = patch.speed;
  if (patch.paused !== undefined) state.paused = patch.paused;
  state.updatedAt = Date.now();
  return { ...state };
}

export function gameTimestamp(day: number, hour: number, minute: number) {
  return (day - 1) * 1440 + hour * 60 + minute;
}

export function nowGameTimestamp() {
  const c = getGameClock();
  return gameTimestamp(c.day, c.hour, c.minute);
}

export function resetGameClock() {
  state = { day: 1, hour: 8, minute: 0, speed: 1, paused: false, updatedAt: Date.now() };
}
