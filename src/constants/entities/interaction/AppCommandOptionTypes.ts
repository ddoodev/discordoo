export enum AppCommandOptionTypes {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP,
  STRING,
  /** Any integer between MIN_SAFE_INTEGER and MAX_SAFE_INTEGER */
  INTEGER,
  BOOLEAN,
  USER,
  /** Includes all channel types + categories */
  CHANNEL,
  ROLE,
  /** Includes users and roles */
  MENTIONABLE,
  /** Any double between MIN_SAFE_INTEGER and MAX_SAFE_INTEGER */
  NUMBER,
}