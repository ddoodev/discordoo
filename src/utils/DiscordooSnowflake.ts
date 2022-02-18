import { DeconstructedDiscordooSnowflake } from '@src/utils/interfaces/DeconstructedSnowflake'
import { DiscordooError } from '@src/utils/DiscordooError'
import { DISCORDOO_EPOCH } from '@src/constants/common'
import { is } from 'typescript-is'
import { ValidationError } from '@src/utils/ValidationError'
import { SHARDING_MANAGER_ID } from '@src/constants'

const EPOCH = DISCORDOO_EPOCH
let INCREMENT = 0

/**
 * DiscordooSnowflake is a custom twitter snowflake used to identify ipc connections and messages.
 * */
export class DiscordooSnowflake {
  // used to identify sharding managers in snowflakes
  public static readonly SHARDING_MANAGER_ID = SHARDING_MANAGER_ID

  /**
   * Custom twitter snowflake: DiscordooSnowflake.
   * ```
   * If we have a snowflake '1128425170719486862453931925225603077' we can represent it as binary:
   *
   *  128                                        86                               54                               22
   *  000000001101100101010011101010000000011011 00000000000000000000000000001011 00000000000000000000000001100011 0000000000000000000101
   *     number of ms since Discordoo epoch                  worker id                       shard id                    increment
   *
   * getting a timestamp:
   *  (BigInt(snowflake) >> 86n) + BigInt(EPOCH) === 1624043753498n
   *
   * getting a worker id:
   *  (BigInt(snowflake) & 0x3FFFFFFFC0000000000000n) >> 54n === 11n
   *
   * getting a shard id:
   *  (BigInt(snowflake) & 0x3FFFFFFFC00000n) >> 22n === 99n
   *
   * getting a increment:
   *  BigInt(snowflake) & 0x3FFFFFn === 5n
   * ```
   * Why?
   * Discordoo uses DiscordooSnowflake to identify ipc connections and messages.
   * So, if your bot has more than 2,147,483,647 shards, you will unfortunately not be able to use Discordoo.
   */

  static generate(shardId: number, workerId = 0, timestamp: number | Date = Date.now()): string {
    // console.log('SNOWFLAKE GENERATE', process.pid, 'DATA', 'shard', shardId, 'worker', workerId, 'timestamp', timestamp)
    if (timestamp instanceof Date) timestamp = timestamp.getTime()

    if (INCREMENT >= 4194302) INCREMENT = 0

    if (!is<number>(shardId)) {
      throw new ValidationError('DiscordooSnowflake#generate', 'shardId must be number.')
    }

    if (!is<number>(workerId)) {
      throw new ValidationError('DiscordooSnowflake#generate', 'workerId must be number.')
    }

    if (!is<number>(timestamp)) {
      throw new ValidationError('DiscordooSnowflake#generate', 'timestamp must be number or Date.')
    }

    if (shardId.toString(2).length > 32 || workerId.toString(2).length > 32) {
      throw new DiscordooError(
        'DiscordooSnowflake#generate',
        'cannot generate snowflake with shardId or workerId that take up more than 32 bits'
      )
    }

    const b = BigInt

    const segments = [
      // 42 bits timestamp block (86 empty bits, 32 for worker id + 32 for shard id + 22 for increment)
      b(timestamp - EPOCH) << b(86),
      // 32 bits worker id block (54 empty bits, 32 for shard id + 22 for increment)
      b(workerId) << b(54),
      // 32 bits worker id block (22 empty bits, 22 for increment)
      b(shardId) << b(22),
      // 22 bits increment block (0 empty bits)
      b(INCREMENT++)
    ]

    // just add up the segments and get valid discordoo snowflake
    return segments.reduce((prev, curr) => prev + curr, b(0)).toString()
  }

  static generatePartial(timestamp: Date | number = Date.now()): string {
    if (timestamp instanceof Date) timestamp = timestamp.getTime()

    const b = BigInt

    return (b(timestamp) - b(EPOCH) << b(86)).toString()
  }

  static deconstruct(snowflake: string): DeconstructedDiscordooSnowflake {
    const b = BigInt, n = Number, bigSnowflake = b(snowflake)

    return {
      // 42 bits timestamp
      timestamp: n((bigSnowflake >> b(86)) + b(EPOCH)),

      // 32 bits workerId, 0x3FFFFFFFC0000000000000 is a 86 bit integer (22 for increment (0) + 32 for shardId (0) + 32 for workerId (1))
      workerId: n((bigSnowflake & b(0x3FFFFFFFC0000000000000)) >> b(54)),

      // 32 bits shardId, 0x3FFFFFFFC00000 is a 54 bit integer (22 for increment (0) + 32 for shardId (1))
      shardId: n((bigSnowflake & b(0x3FFFFFFFC00000)) >> b(22)),

      // 22 bits increment, 0x3FFFFF is a max 22 bit integer
      increment: n(bigSnowflake & b(0x3FFFFF)),

      get date() {
        return new Date(this.timestamp)
      }
    }
  }
}
