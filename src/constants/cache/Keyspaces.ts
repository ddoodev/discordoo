export enum Keyspaces {
  // guilds => global => guild id
  Guilds = 'guilds',
  // users => global => user id
  Users = 'users',
  // channels => guild id or 'dm' => channel id
  Channels = 'channels',
  // messages => channel id => message id
  Messages = 'messages',
  // pinned-messages => channel id => message id
  PinnedMessages = 'pinned-messages',
  // stickers => default or guild id => sticker id
  Stickers = 'stickers',
  /**
   * message-reactions => message id => reaction identifier
   * OR
   * message-reactions => message id => reaction identifier (pointer) => guild-emojis => guild id => emoji id
   * */
  MessageReactions = 'message-reactions',
  // message-reaction-users => message id => reaction identifier (pointer) => users => global => user id
  MessageReactionUsers = 'message-reaction-users',
  // channel-permissions-overwrites => channel id => user or role id
  ChannelPermissionsOverwrites = 'channel-permissions-overwrites',
  // category-channel-children => channel id (pointer) => guild-channels => guild id => channel id
  CategoryChannelChildren = 'category-channel-children',
  // dm-channels => user id => channel id (pointer) => channels => channel id
  DmChannels = 'dm-channels',
  // guild-members => guild id => member user id
  GuildMembers = 'guild-members',
  // guild-member-roles => guild id + member user id => role id (pointer) => guild-roles => guild id => role id
  GuildMemberRoles = 'guild-member-roles',
  // guild-presences => guild id => user id
  GuildPresences = 'guild-presences',
  // guild-roles => guild id => role id
  GuildRoles = 'guild-roles',
  // guild-emojis => guild id => emoji id
  GuildEmojis = 'guild-emojis',
  // thread-members => thread id => member id
  ThreadMembers = 'thread-members',
  // invites => global => invite code
  Invites = 'invites',
  // invite-guilds => global => guild id
  InviteGuilds = 'invite-guilds',
  // application-commands => global => command name
  ApplicationCommands = 'application-commands',
  // other => any id (pointer) => any other cache
  Other = 'other',
}
