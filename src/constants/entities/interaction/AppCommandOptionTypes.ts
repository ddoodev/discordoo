export enum AppCommandOptionTypes {
    Subcommand = 1,
    SubcommandGroup = 2,
    String = 3,
    /** Any integer between MIN_SAFE_INTEGER and MAX_SAFE_INTEGER */
    Integer = 4,
    Boolean = 5,
    User = 6,
    /** Includes all channel types + categories */
    Channel = 7,
    Role = 8,
    /** Includes users and roles */
    Mentionable = 9,
    /** Any double between MIN_SAFE_INTEGER and MAX_SAFE_INTEGER */
    Number = 10,
    /** Any attachment */
    Attachment = 11
}
