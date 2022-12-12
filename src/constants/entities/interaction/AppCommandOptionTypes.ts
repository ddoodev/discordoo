export enum AppCommandOptionTypes {
  Subcommand = 1,
  SubcommandGroup,
  String,
  /** Any integer between MIN_SAFE_INTEGER and MAX_SAFE_INTEGER */
  Integer,
  Boolean,
  User,
  /** Includes all channel types + categories */
  Channel,
  Role,
  /** Includes users and roles */
  Mentionable,
  /** Any double between MIN_SAFE_INTEGER and MAX_SAFE_INTEGER */
  Number,
  /** Any attachment */
  Attachment,
}
