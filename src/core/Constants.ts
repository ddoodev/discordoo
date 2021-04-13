import { RESTOptions } from '@src/rest'
import { version } from '@root/package.json'

export default class Constants {
  static API_ENDPOINT = 'https://discord.com/api'
  static DEFAULT_REST_OPTIONS: RESTOptions = {
    v: 8,
    useragent: `DiscordBot (https://github.com/Discordoo/discordoo, ${version})`,
    maxRetries: 5
  }
}