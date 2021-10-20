export const ActivityFlags = {
  INSTANCE: 1 << 0,
  JOIN: 1 << 1,
  SPECTATE: 1 << 2,
  JOIN_REQUEST: 1 << 3,
  SYNC: 1 << 4,
  PLAY: 1 << 5,
} as const
