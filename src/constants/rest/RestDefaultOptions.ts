import { version } from '@root/package.json'
import { RestOptions } from '@src/rest/interfaces/RestOptions'

export const REST_DEFAULT_OPTIONS: Required<RestOptions> = {
  version: 9,
  userAgent: `DiscordBot (https://github.com/Discordoo/discordoo, ${version}) NodeJS/${process.version}`,
  maxRetries: 1,
  requestTimeout: 30000,
  latencyThreshold: 30000,
}
