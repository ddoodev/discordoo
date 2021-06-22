import DeconstructedDiscordooSnowflake from '@src/interfaces/utils/DeconstructedSnowflake'
import DiscordooError from '@src/utils/DiscordooError'

const EPOCH = 1609459200000 // 2021-01-01T00:00:00.000Z
let INCREMENT = 0

/**
 * DiscordooSnowflake is a custom twitter snowflake used to identify ipc connections and messages.
 * */

export default class DiscordooSnowflake {
  // used to identify sharding managers in snowflakes
  public static readonly SHARDING_MANAGER_ID = 1_111_111_111

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

  static generate(shardID: number, workerID = 0, timestamp: number | Date = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime()

    if (INCREMENT >= 4194302) INCREMENT = 0

    if (shardID.toString(2).length > 32 || workerID.toString(2).length > 32) {
      throw new DiscordooError(
        'DiscordooSnowflake#generate',
        'cannot generate snowflake with shardID or workerID that take up more than 32 bits'
      )
    }

    const toString = (num: number, padStart: number) => num.toString(2).padStart(padStart, '0')

    const binarySegments = [
      toString(timestamp - EPOCH, 42), // 42 bits for timestamp
      toString(workerID, 32), // 32 bits for worker id
      toString(shardID, 32), // 32 bits for shard id
      toString(INCREMENT++, 22) // 22 bits for increment
    ]

    return this.binaryToID(binarySegments.join(''))
  }

  static deconstruct(snowflake: string): DeconstructedDiscordooSnowflake {
    const b = BigInt, n = Number

    const res = {
      timestamp: n((b(snowflake) >> 86n) + b(EPOCH)),

      // 32 bit workerID (0x3FFFFFFFC0000000000000 22 bit increment (0) + 32 bit shardID (0) + 32 bit workerID (1))
      workerID: n((b(snowflake) & 0x3FFFFFFFC0000000000000n) >> 54n),

      // 32 bit shardID, 0x3FFFFFFFC00000 is a 54 bit integer (22 bit increment (0) + 32 bit shardID (1))
      shardID: n((b(snowflake) & 0x3FFFFFFFC00000n) >> 22n),

      // 22 bit increment, 0x3FFFFF is a max 22 bit integer
      increment: n(b(snowflake) & 0x3FFFFFn),
    }

    Object.defineProperty(res, 'date', {
      get: function get() {
        return new Date(this.timestamp)
      },
      enumerable: true,
    })

    return res as DeconstructedDiscordooSnowflake
  }

  static binaryToID(str: string, base: number | bigint = 2) {
    base = BigInt(base)

    let bigint = 0n

    for (let i = 0; i < str.length; i++) {
      let code = str[str.length - 1 - i].charCodeAt(0) - 48
      if (code >= 10) code -= 39
      bigint += base ** BigInt(i) * BigInt(code)
    }

    return bigint.toString()
  }
}
