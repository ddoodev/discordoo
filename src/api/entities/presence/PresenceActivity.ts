import { ActivityEmoji, EntitiesUtil, Json, ReadonlyActivityFlagsUtil, ToJsonProperties } from '@src/api'
import { PresenceActivityData } from '@src/api/entities/presence/interfaces/PresenceActivityData'
import { PresenceActivityButtonData } from '@src/api/entities/presence/interfaces/PresenceActivityButtonData'
import { PresenceActivityPartyData } from '@src/api/entities/presence/interfaces/PresenceActivityPartyData'
import { PresenceActivitySecretsData } from '@src/api/entities/presence/interfaces/PresenceActivitySecretsData'
import { PresenceActivityTimestampsData } from '@src/api/entities/presence/interfaces/PresenceActivityTimestampsData'
import { IgnoreAllSymbol, PresenceActivityTypes } from '@src/constants'
import { RawPresenceActivityData } from '@src/api/entities/presence/interfaces/RawPresenceActivityData'
import { PresenceActivityAssets } from '@src/api/entities/presence/PresenceActivityAssets'
import { attach, WebSocketUtils } from '@src/utils'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export class PresenceActivity extends AbstractEntity {
  public applicationId?: string
  public assets?: PresenceActivityAssets
  public buttons?: PresenceActivityButtonData[]
  public createdTimestamp?: number
  public details?: string
  public emoji?: ActivityEmoji
  public flags?: ReadonlyActivityFlagsUtil
  public instance?: boolean
  public declare name: string
  public party?: PresenceActivityPartyData
  public secrets?: PresenceActivitySecretsData
  public state?: string
  public timestamps?: PresenceActivityTimestampsData
  public declare type: PresenceActivityTypes
  public url?: string

  async init(data: PresenceActivityData | RawPresenceActivityData, options?: EntityInitOptions): Promise<this> {

    if (data.emoji) {
      const ActivityEmoji = EntitiesUtil.get('ActivityEmoji')
      data.emoji = await new ActivityEmoji(this.client).init(data.emoji)
    }

    if (WebSocketUtils.exists(data.flags)) {
      data.flags = new ReadonlyActivityFlagsUtil(data.flags)
    }

    attach(this, data, {
      props: [
        [ 'applicationId', 'application_id' ],
        'buttons',
        'details',
        'instance',
        'name',
        'party',
        'secrets',
        'state',
        'timestamps',
        'type',
        'url',
        'emoji',
        'flags',
        [ 'createdTimestamp', 'created_at' ],
      ],
      disabled: options?.ignore
    })

    if (data.assets) {
      // @ts-ignore
      if (!options?.ignore?.includes('assets') && !options?.ignore?.includes(IgnoreAllSymbol)) {
        const ActivityAssets = EntitiesUtil.get('PresenceActivityAssets')
        this.assets = await new ActivityAssets(this.client).init({ ...data.assets, applicationId: this.applicationId })
      }
    }

    return this
  }

  get createdDate(): Date | undefined {
    return this.createdTimestamp ? new Date(this.createdTimestamp) : undefined
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      applicationId: true,
      assets: true,
      buttons: true,
      createdTimestamp: true,
      details: true,
      emoji: true,
      flags: true,
      instance: true,
      name: true,
      party: true,
      secrets: true,
      state: true,
      timestamps: true,
      type: true,
      url: true,
    }, obj)
  }

}
