export enum Keyspaces {
  // guilds => global => guild id
  GUILDS = 'guilds',
  // users => global => user id
  USERS = 'users',
  // guild-members => guild id => member user id
  GUILD_MEMBERS = 'guild-members',
  // guild-member-roles => guild id + member user id => role id (pointer) => guild-roles => guild id => role id
  GUILD_MEMBER_ROLES = 'guild-member-roles',
  // guild-channels => guild id => channel id
  GUILD_CHANNELS = 'guild-channels',
  // guild-presences => guild id => user id
  GUILD_PRESENCES = 'guild-presences',
  // guild-roles => guild id => role id
  GUILD_ROLES = 'guild-roles',
  // guild-emojis => guild id => emoji id
  GUILD_EMOJIS = 'guild-emojis',
  // guild-roles-positions => guild id => role id
  GUILD_ROLES_POSITIONS = 'guild-roles-positions',
  // messages => channel id => message id
  MESSAGES = 'messages',
  // stickers => global or guild id => sticker id
  STICKERS = 'stickers',
  /**
   * message-reactions => message id => reaction identifier
   * OR
   * message-reactions => message id => reaction identifier (pointer) => guild-emojis => guild id => emoji id
   * */
  MESSAGE_REACTIONS = 'message-reactions',
  // message-reaction-users => message id => reaction identifier (pointer) => users => global => user id
  MESSAGE_REACTION_USERS = 'message-reaction-users',
  // channel-permissions-overwrites => channel id => user or role id
  CHANNEL_PERMISSIONS_OVERWRITES = 'channel-permissions-overwrites',
}
