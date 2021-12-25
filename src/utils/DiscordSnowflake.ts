import { DeconstructedDiscordSnowflake } from '@src/utils/interfaces/DeconstructedSnowflake'
import { DISCORD_EPOCH } from '@src/constants/common'
import { DiscordooError } from '@src/utils/DiscordooError'

const EPOCH = DISCORD_EPOCH
let INCREMENT = 0

// https://discord.com/developers/docs/reference#snowflakes
export class DiscordSnowflake {

  // Generate full copy of original discord snowflake
  static generate(
    timestamp: number | Date = Date.now(),
    workerId = 0,
    processId = 0,
    increment?: number
  ): string {
    if (timestamp instanceof Date) timestamp = timestamp.getTime()

    if (INCREMENT >= 4194302) INCREMENT = 0

    if (timestamp <= EPOCH) {
      throw new DiscordooError('DiscordSnowflake#generate', 'Timestamp cannot be earlier than discord epoch (1420070400000).')
    }

    if (increment && increment >= 4194302) {
      throw new DiscordooError('DiscordSnowflake#generate', 'Increment must be lower than 4194303.')
    }

    if (workerId >= 0x1F) {
      throw new DiscordooError('DiscordSnowflake#generate', 'Internal worker id must be lower than 31.')
    }

    if (processId >= 0x1F) {
      throw new DiscordooError('DiscordSnowflake#generate', 'Internal process id must be lower than 31.')
    }

    const b = BigInt

    const segments = [
      // 42 bits timestamp block (22 empty bits, 5 for worker id + 5 for process id + 12 for increment)
      b(timestamp - EPOCH) << b(22),
      // 5 bits worker id block (17 empty bits, 5 for shard id + 12 for increment)
      b(workerId) << b(17),
      // 5 bits worker id block (12 empty bits, 12 for increment)
      b(processId) << b(12),
      // 12 bits increment block (0 empty bits)
      b(increment ?? INCREMENT++)
    ]

    // just add up the segments and get valid discord snowflake
    return segments.reduce((prev, curr) => prev + curr, b(0)).toString()
  }

  static generatePartial(timestamp: Date | number = Date.now()): string {
    if (timestamp instanceof Date) timestamp = timestamp.getTime()

    const b = BigInt

    return (b(timestamp - EPOCH) << b(22)).toString()
  }

  static deconstruct(snowflake: string): DeconstructedDiscordSnowflake {
    const b = BigInt, n = Number, bigSnowflake = b(snowflake)

    // https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right
    return {
      // 42 bits timestamp
      timestamp: n((bigSnowflake >> b(22)) + b(EPOCH)),

      // 5 bits worker id
      workerId: n((bigSnowflake & b(0x3E0000)) >> b(17)),

      // 5 bits process id
      processId: n((bigSnowflake & b(0x1F000)) >> b(12)),

      // 12 bits increment, 0xFFF is a max 12 bit integer
      increment: n(bigSnowflake & b(0xFFF)),

      get date() {
        return new Date(this.timestamp)
      }
    }
  }
}
