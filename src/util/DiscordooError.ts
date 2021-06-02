export default class DiscordooError extends Error {
  public name = 'DiscordooError'

  // @ts-ignore
  constructor(source?: string, ...args: any[]) {
    if (source) args.unshift(`[${source}]`)

    super(args.join(' '))
  }
}
