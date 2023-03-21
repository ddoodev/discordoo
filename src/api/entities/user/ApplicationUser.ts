import { PresenceUpdateData, PresenceUpdateOptions } from '@src/api/entities/presence'
import { is } from 'typescript-is'
import { makeCompletedPresence, resolveDiscordShards, ValidationError } from '@src/utils'
import { GatewayOpCodes } from '@discordoo/providers'
import { IpcPresenceUpdatePacket } from '@src/sharding'
import { IpcEvents, IpcOpCodes } from '@src/constants'
import { DiscordApplication } from '@src/core'
import { RestApplicationUser } from '@src/api/entities/user/RestApplicationUser'

export class ApplicationUser extends RestApplicationUser {
  public declare app: DiscordApplication

  async updatePresence(data: PresenceUpdateData, options?: PresenceUpdateOptions): Promise<this> {
    if (!is<PresenceUpdateData>(data)) {
      throw new ValidationError('ApplicationUser#updatePresence', 'Invalid presence update data')
    }

    const shards = resolveDiscordShards(
      options?.shards === 'all' ? this.app.sharding.totalShards : options?.shards ?? this.app.sharding.shards
    )

    const [ served, notServed ] = shards.reduce<[ number[], number[] ]>((all, curr) => {
      this.app.sharding.shards.includes(curr) ? all[0].push(curr) : all[1].push(curr)
      return all
    }, [ [], [] ])

    const presence = await makeCompletedPresence(data, this.app)

    this.app.internals.gateway.send({
      op: GatewayOpCodes.STATUS_UPDATE,
      d: presence
    }, { shards: served })

    if (notServed.length) {
      const request: IpcPresenceUpdatePacket = {
        op: IpcOpCodes.DISPATCH,
        t: IpcEvents.PRESENCE_UPDATE,
        d: {
          event_id: this.app.internals.ipc.generate(),
          presence: data,
          shards: notServed
        }
      }

      await this.app.internals.ipc.send(request)
    }

    return this
  }

}
