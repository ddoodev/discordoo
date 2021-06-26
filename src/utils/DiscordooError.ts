import { inspect } from 'util'

/** Custom error class to create human-readable errors */
export class DiscordooError extends Error {
  public name = 'DiscordooError'

  // @ts-ignore
  constructor(source?: string, ...args: any[]) {
    if (source) args.unshift(`[${source}]`)

    super(args.map(a => typeof a !== 'string' ? inspect(a) : a).join(' '))
  }
}
