import DeconstructedDiscordooSnowflake from '@src/interfaces/utils/DeconstructedSnowflake'

const EPOCH = 1609459200000 // 2021-01-01T00:00:00.000Z
let INCREMENT = 0

/**
 * DiscordooSnowflake is a
 * thanks devsnek and drahcirius, original code creators
 * @see https://github.com/devsnek
 * @see https://github.com/Drahcirius
 * */

export default class DiscordooSnowflake {

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
   *  BigInt(snowflake) >> 86n + BigInt(EPOCH) === 1624043753498n
   *
   * getting a worker id:
   *  BigInt(snowflake) & 0x7FFFFFFFn >> 54n === 11n
   *
   * getting a shard id:
   *  BigInt(snowflake) & 0x7FFFFFFFn >> 22n === 99n
   *
   * getting a increment:
   *  BigInt(snowflake) & 0x3FFFFFn === 5n
   * ```
   * Why?
   * Discordoo uses DiscordooSnowflake to identify ipc connections.
   * So, if your bot has more than 2,147,483,647 shards, you will unfortunately not be able to use Discordoo.
   */

  static generate(shardID: number, workerID = 0, timestamp: number | Date = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime()

    if (INCREMENT >= 4194302) INCREMENT = 0

    const toString = (num: number, padStart: number) => num.toString(2).padStart(padStart, '0')

    const binarySegments = [
      toString(timestamp - EPOCH, 42), // 42 bits for timestamp
      toString(workerID, 32), // 32 bits for worker id
      toString(shardID, 32), // 32 bits for shard id
      toString(INCREMENT, 22) // 22 bits for increment
    ]

    return this.binaryToID(binarySegments.join())
  }

  static deconstruct(snowflake: string): DeconstructedDiscordooSnowflake {

    const b = BigInt, n = Number

    const res = {
      timestamp:  n((b(snowflake) >> b(86)) + b(EPOCH)),
      workerID:   n((b(snowflake) & b(0x7FFFFFFF)) >> b(54)), // 32 bit shardID, 0x7FFFFFFF is a max 32 bit integer
      shardID:    n((b(snowflake) & b(0x7FFFFFFF)) >> b(22)), // 32 bit shardID
      increment:  n(b(snowflake) & b(0x3FFFFF)), // 22 bit increment, 0x3FFFFF is a max 22 bit integer
    }

    Object.defineProperty(res, 'date', {
      get: function get() {
        return new Date(this.timestamp)
      },
      enumerable: true,
    })

    return res as DeconstructedDiscordooSnowflake
  }

  static binaryToID(num: any) {
    let dec = ''

    while (num.length > 50) {
      const high = parseInt(num.slice(0, -32), 2)
      const low = parseInt((high % 10).toString(2) + num.slice(-32), 2)

      dec = (low % 10).toString() + dec
      num =
        Math.floor(high / 10).toString(2) +
        Math.floor(low / 10)
          .toString(2)
          .padStart(32, '0')
    }

    num = parseInt(num, 2)
    while (num > 0) {
      dec = (num % 10).toString() + dec
      num = Math.floor(num / 10)
    }

    return dec
  }
}
