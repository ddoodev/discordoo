import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames } from '@src/constants'
import { RawShardConnectedEventData } from '@src/events/interfaces/RawShardConnectedEventData'
import { Client } from '@src/core'
import { ShardConnectedHandlerContext } from '@src/events/interfaces/ShardConnectedHandlerContext'

export class ShardConnectedEvent extends AbstractEvent {
  public name = EventNames.SHARD_CONNECTED

  execute(shardId: number, data: RawShardConnectedEventData) {

    const timeout: NodeJS.Timeout = setTimeout((client: Client, shard: number) => {
      const queue = client.internals.queues.ready.get(shard)

      if (queue) {
        client.internals.queues.ready.delete(shard)
        client.emit(EventNames.SHARD_CONNECTED, {
          id: shard,
          unavailable: queue.guilds?.map(g => ({ id: g, unavailable: true })) ?? [],
          user: data.user
        })
        client._increaseConnected()
      }
    }, 15_000, this.client, shardId) as any

    const handler = (client: Client, context: ShardConnectedHandlerContext) => {
      if (context.guild) {
        const index = context.guilds.indexOf(context.guild)
        if (index > -1) {
          context.guilds.splice(index, 1)
        }
        context.timeout.refresh()
        delete context.guild
        client.internals.queues.ready.set(context.shardId, context)
      }

      if (!context.guilds.length) {
        clearTimeout(context.timeout)
        client.internals.queues.ready.delete(context.shardId)
        client.emit(EventNames.SHARD_CONNECTED, {
          id: context.shardId,
          unavailable: [],
          user: context.user,
        })
        client._increaseConnected()
      }
    }

    if (data.guilds.length) {
      this.client.internals.queues.ready.set(shardId, {
        shardId,
        guilds: data.guilds.map(g => g.id),
        handler,
        timeout,
        user: data.user,
      })
    } else {
      this.client.emit(EventNames.SHARD_CONNECTED, {
        id: shardId,
        unavailable: [],
        user: data.user
      })
      this.client._increaseConnected()
    }

  }
}