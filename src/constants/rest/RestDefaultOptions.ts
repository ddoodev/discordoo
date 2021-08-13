import { RestOptions } from '@src/rest/interfaces/RestOptions'
import { version } from '@src/utils'

export const REST_DEFAULT_OPTIONS: Required<Omit<RestOptions, 'auth'>> = {
  version: 9,
  userAgent: `DiscordBot (https://github.com/Discordoo/discordoo, ${version}) NodeJS/${process.version}`,
  maxRetries: 1,
  requestTimeout: 30000,
  latencyThreshold: 30000,
  domain: 'discord.com',
  scheme: 'https',
  headers: {},
  rateLimits: {
    disable: false,
    globalLimit: 50,
    invalidLimit: 10_000,
  },
}
