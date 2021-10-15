export interface AbstractGuildEmoji<GuildType> {
  guildId: string
  requiresColons: boolean
  managed: boolean
  available: boolean

  getGuild(): Promise<GuildType | undefined>
}
