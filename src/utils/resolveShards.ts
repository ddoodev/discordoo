import { ShardListResolvable } from '@src/core/ShardListResolvable'
import { range } from '@src/utils/range'
import { DiscordooError } from '@src/utils/DiscordooError'

export function resolveShards(shards: ShardListResolvable): number[] {
  const source = 'ShardListResolver'
  let result: number[]

  switch (typeof shards) {
    case 'number':
      result = range(shards)
      break

    case 'string':
      if (!isNaN(parseInt(shards))) {
        result = range(parseInt(shards))
      } else {
        throw new DiscordooError(source, 'received disallowed shard list type: string, value:', shards)
      }
      break

    case 'object':
      if (Array.isArray(shards)) {
        const arr = shards.filter(v => typeof v !== 'number' || isNaN(v))
        if (arr.length) {
          throw new DiscordooError(source, 'array of shards contains non-number value. array:', shards)
        }

        result = shards
      } else {
        if (typeof shards.from !== 'number' || typeof shards.to !== 'number') {
          throw new DiscordooError(source, 'received object as shard list, but shards.from or shards.to is not a number.')
        }

        shards = range(shards.from, shards.to)
      }
      break

    default:
      throw new DiscordooError(source, 'received disallowed shard list type:', typeof shards)
  }

  return result!
}
