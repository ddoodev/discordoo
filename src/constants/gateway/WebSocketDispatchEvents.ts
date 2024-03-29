export enum WebSocketDispatchEvents {
  ChannelCreate = 'CHANNEL_CREATE',
  ChannelDelete = 'CHANNEL_DELETE',
  ChannelPinsUpdate = 'CHANNEL_PINS_UPDATE',
  ChannelUpdate = 'CHANNEL_UPDATE',
  GuildBanAdd = 'GUILD_BAN_ADD',
  GuildBanRemove = 'GUILD_BAN_REMOVE',
  GuildCreate = 'GUILD_CREATE',
  GuildDelete = 'GUILD_DELETE',
  GuildEmojisUpdate = 'GUILD_EMOJIS_UPDATE',
  GuildIntegrationsUpdate = 'GUILD_INTEGRATIONS_UPDATE',
  GuildMemberAdd = 'GUILD_MEMBER_ADD',
  GuildMemberRemove = 'GUILD_MEMBER_REMOVE',
  GuildMembersChunk = 'GUILD_MEMBERS_CHUNK',
  GuildMemberUpdate = 'GUILD_MEMBER_UPDATE',
  GuildRoleCreate = 'GUILD_ROLE_CREATE',
  GuildRoleDelete = 'GUILD_ROLE_DELETE',
  GuildRoleUpdate = 'GUILD_ROLE_UPDATE',
  GuildStickersUpdate = 'GUILD_STICKERS_UPDATE',
  GuildUpdate = 'GUILD_UPDATE',
  IntegrationCreate = 'INTEGRATION_CREATE',
  IntegrationDelete = 'INTEGRATION_DELETE',
  IntegrationUpdate = 'INTEGRATION_UPDATE',
  InteractionCreate = 'INTERACTION_CREATE',
  InviteCreate = 'INVITE_CREATE',
  InviteDelete = 'INVITE_DELETE',
  MessageCreate = 'MESSAGE_CREATE',
  MessageDelete = 'MESSAGE_DELETE',
  MessageDeleteBulk = 'MESSAGE_DELETE_BULK',
  MessageReactionAdd = 'MESSAGE_REACTION_ADD',
  MessageReactionRemove = 'MESSAGE_REACTION_REMOVE',
  MessageReactionRemoveAll = 'MESSAGE_REACTION_REMOVE_ALL',
  MessageReactionRemoveEmoji = 'MESSAGE_REACTION_REMOVE_EMOJI',
  MessageUpdate = 'MESSAGE_UPDATE',
  PresenceUpdate = 'PRESENCE_UPDATE',
  StageInstanceCreate = 'STAGE_INSTANCE_CREATE',
  StageInstanceDelete = 'STAGE_INSTANCE_DELETE',
  StageInstanceUpdate = 'STAGE_INSTANCE_UPDATE',
  Ready = 'READY',
  Resumed = 'RESUMED',
  ThreadCreate = 'THREAD_CREATE',
  ThreadDelete = 'THREAD_DELETE',
  ThreadListSync = 'THREAD_LIST_SYNC',
  ThreadMembersUpdate = 'THREAD_MEMBERS_UPDATE',
  ThreadMemberUpdate = 'THREAD_MEMBER_UPDATE',
  ThreadUpdate = 'THREAD_UPDATE',
  TypingStart = 'TYPING_START',
  UserUpdate = 'USER_UPDATE',
  VoiceServerUpdate = 'VOICE_SERVER_UPDATE',
  VoiceStateUpdate = 'VOICE_STATE_UPDATE',
  WebhooksUpdate = 'WEBHOOKS_UPDATE',
}
