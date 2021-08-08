import { DiscordooSnowflake } from '@src/utils'

describe('DiscordooSnowflake', () => {

  const params = {
    shardID: 8379,
    workerID: 543029,
    timestamp: 1624754866109,
    result: '1183444843991979760462785602312470528'
  }

  test('must generate snowflake', () => {
    expect(
      DiscordooSnowflake.generate(params.shardID, params.workerID, params.timestamp)
    ).toBe(params.result)
  })

  test('must deconstruct snowflake', () => {
    const result = DiscordooSnowflake.deconstruct(params.result)

    expect(result.shardID).toBe(params.shardID)
    expect(result.workerID).toBe(params.workerID)
    expect(result.timestamp).toBe(params.timestamp)
  })

})
