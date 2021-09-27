import { DiscordooSnowflake } from '@src/utils'

describe('DiscordooSnowflake', () => {

  const params = {
    shardId: 8379,
    workerId: 543029,
    timestamp: 1624754866109,
    result: '1183444843991979760462785602312470528'
  }

  test('must generate snowflake', () => {
    expect(
      DiscordooSnowflake.generate(params.shardId, params.workerId, params.timestamp)
    ).toBe(params.result)
  })

  test('must deconstruct snowflake', () => {
    const result = DiscordooSnowflake.deconstruct(params.result)

    expect(result.shardId).toBe(params.shardId)
    expect(result.workerId).toBe(params.workerId)
    expect(result.timestamp).toBe(params.timestamp)
  })

})
