import { Client } from '@src/core'
import { DiscordooError, range, ShardListResolvable } from '@src/utils'

export function resolveShards(client: Client, shards: ShardListResolvable | 'all' | 'current'): number[] {
  const source = 'ShardListResolver'
  let result: number[]

  switch (typeof shards) {
    case 'string': {
      switch (true) {
        case shards === 'all':
          result = range(client.internals.sharding.totalShards)
          break

        case shards === 'current':
          result = [ ...client.internals.sharding.shards ]
          break

        case !isNaN(parseInt(shards)):
          result = [ parseInt(shards) ]
          break

        default:
          throw new DiscordooError(source, 'do not know how to resolve shards from this string:', shards)
      }
    } break

    case 'object':
      if (Array.isArray(shards)) {
        if (shards.filter(v => typeof v !== 'number' || isNaN(v)).length) {
          throw new DiscordooError(source, 'array of shards contains non-number value. array:', shards)
        }

        result = shards
      } else {
        const shardsIsNaN = new DiscordooError(source, 'received object as shard list, but shards.from or shards.to is not a number.')

        if (typeof shards.from !== 'number' || typeof shards.to !== 'number') {
          throw shardsIsNaN
        }

        if (isNaN(shards.from) || isNaN(shards.to)) {
          throw shardsIsNaN
        }

        shards = range(shards.from, shards.to)
      }
      break

    case 'number':
      result = [ shards ]
      break

    default:
      throw new DiscordooError(source, 'do not know how to resolve shards from', typeof shards + '.', 'provided shards:', shards)
  }

  return result!
}
