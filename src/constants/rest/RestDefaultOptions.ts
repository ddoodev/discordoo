import { version } from '@root/package.json'

export const REST_DEFAULT_OPTIONS: any /* RESTOptions */ = {
  v: 9,
  useragent: `DiscordBot (https://github.com/Discordoo/discordoo, ${version})`,
  maxRetries: 5
}
