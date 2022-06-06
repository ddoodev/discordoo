import { version } from '@src/utils/version'
import { CompletedRestOptions } from '@src/rest'

export const REST_DEFAULT_OPTIONS: CompletedRestOptions = {
  requestTimeout: 30_000,
  userAgent: `DiscordBot (https://github.com/ddoodev/discordoo, ${version}) NodeJS/${process.version}`,
  retries: 2,
  cdn: {
    defaultImgFormat: 'png',
    defaultImgSize: 128,
    domain: 'cdn.discordapp.com',
  },
  api: {
    version: 10,
    domain: 'discord.com',
    scheme: 'https',
    path: '/api/v',
    auth: 'Bot ...',
    headers: {},
  },
  limits: {
    disable: false,
    globalLimit: 50,
    invalidLimit: 10_000,
  },
}
