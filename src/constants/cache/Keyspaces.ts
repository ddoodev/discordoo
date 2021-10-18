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
  // messages => channel id => message id
  MESSAGES = 'messages',
  // stickers => global or guild id => sticker id
  STICKERS = 'stickers',
}
