import { User } from '@src/api/entities/user/User'
import { PresenceUpdateData, PresenceUpdateOptions } from '@src/api/entities/presence'
import { is } from 'typescript-is'
import { makeCompletedPresence, resolveDiscordShards, ValidationError } from '@src/utils'
import { GatewayOpCodes } from '@discordoo/providers'
import { IpcPresenceUpdatePacket } from '@src/sharding'
import { IpcEvents, IpcOpCodes } from '@src/constants'

export class ClientUser extends User {

  async updatePresence(data: PresenceUpdateData, options?: PresenceUpdateOptions): Promise<this> {
    if (!is<PresenceUpdateData>(data)) {
      throw new ValidationError('ClientUser#updatePresence', 'Invalid presence update data')
    }

    const shards = resolveDiscordShards(
      options?.shards === 'all' ? this.client.sharding.totalShards : options?.shards ?? this.client.sharding.shards
    )

    const [ served, notServed ] = shards.reduce<[ number[], number[] ]>((all, curr) => {
      this.client.sharding.shards.includes(curr) ? all[0].push(curr) : all[1].push(curr)
      return all
    }, [ [], [] ])

    const presence = await makeCompletedPresence(data, this.client)

    this.client.internals.gateway.send({
      op: GatewayOpCodes.STATUS_UPDATE,
      d: presence
    }, { shards: served })

    if (notServed.length) {
      const request: IpcPresenceUpdatePacket = {
        op: IpcOpCodes.DISPATCH,
        t: IpcEvents.PRESENCE_UPDATE,
        d: {
          event_id: this.client.internals.ipc.generate(),
          presence: data,
          shards: notServed
        }
      }

      await this.client.internals.ipc.send(request)
    }

    return this
  }

}
