import { AbstractEvent } from '@src/events/AbstractEvent'
import { EventNames } from '@src/constants'
import { RawShardConnectedEventData } from '@src/events/interfaces/RawShardConnectedEventData'
import { DiscordApplication } from '@src/core'
import { ShardConnectedHandlerContext } from '@src/events/interfaces/ShardConnectedHandlerContext'
import { AbstractEventContext } from '@src/events/interfaces'

export class ShardConnectedEvent extends AbstractEvent<AbstractEventContext> {
  public name = EventNames.SHARD_CONNECTED

  execute(shardId: number, data: RawShardConnectedEventData) {

    const timeout: NodeJS.Timeout = setTimeout((app: DiscordApplication, shard: number) => {
      const queue = app.internals.queues.ready.get(shard)

      if (queue) {
        app.internals.queues.ready.delete(shard)
        app.emit(EventNames.SHARD_CONNECTED, {
          id: shard,
          unavailable: queue.guilds?.map(g => ({ id: g, unavailable: true as const })) ?? [],
          user: data.user
        })
        app._increaseConnected()
      }
    }, 15_000, this.app, shardId) as any

    const handler = (app: DiscordApplication, context: ShardConnectedHandlerContext) => {
      if (context.guild) {
        const index = context.guilds.indexOf(context.guild)
        if (index > -1) {
          context.guilds.splice(index, 1)
        }
        context.timeout.refresh()
        delete context.guild
        app.internals.queues.ready.set(context.shardId, context)
      }

      if (!context.guilds.length) {
        clearTimeout(context.timeout)
        app.internals.queues.ready.delete(context.shardId)
        app.emit(EventNames.SHARD_CONNECTED, {
          id: context.shardId,
          unavailable: [],
          user: context.user,
        })
        app._increaseConnected()
      }
    }

    if (data.guilds.length) {
      this.app.internals.queues.ready.set(shardId, {
        shardId,
        guilds: data.guilds.map(g => g.id),
        handler,
        timeout,
        user: data.user,
      })
    } else {
      this.app.emit(EventNames.SHARD_CONNECTED, {
        id: shardId,
        unavailable: [],
        user: data.user
      })
      this.app._increaseConnected()
    }

    return {
      shardId
    }
  }
}