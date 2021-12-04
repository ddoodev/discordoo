import { ActivityEmoji, Json, ReadonlyActivityFlagsUtil, ToJsonProperties } from '@src/api'
import { PresenceActivityData } from '@src/api/entities/presence/interfaces/PresenceActivityData'
import { PresenceActivityButtonData } from '@src/api/entities/presence/interfaces/PresenceActivityButtonData'
import { PresenceActivityPartyData } from '@src/api/entities/presence/interfaces/PresenceActivityPartyData'
import { PresenceActivitySecretsData } from '@src/api/entities/presence/interfaces/PresenceActivitySecretsData'
import { PresenceActivityTimestampsData } from '@src/api/entities/presence/interfaces/PresenceActivityTimestampsData'
import { PresenceActivityTypes, ToJsonOverrideSymbol } from '@src/constants'
import { RawPresenceActivityData } from '@src/api/entities/presence/interfaces/RawPresenceActivityData'
import { PresenceActivityAssets } from '@src/api/entities/presence/PresenceActivityAssets'
import { attach, WebSocketUtils } from '@src/utils'
import { AbstractEntity } from '@src/api/entities/AbstractEntity'

export class PresenceActivity extends AbstractEntity {
  public applicationId?: string
  public assets?: PresenceActivityAssets
  public buttons?: PresenceActivityButtonData[]
  public createdTimestamp?: number
  public details?: string
  public emoji?: ActivityEmoji
  public flags?: ReadonlyActivityFlagsUtil
  public instance?: boolean
  public name!: string
  public party?: PresenceActivityPartyData
  public secrets?: PresenceActivitySecretsData
  public state?: string
  public timestamps?: PresenceActivityTimestampsData
  public type!: PresenceActivityTypes
  public url?: string

  async init(data: PresenceActivityData | RawPresenceActivityData): Promise<this> {
    attach(this, data, [
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
      [ 'createdTimestamp', 'created_at' ],
    ])

    if (data.assets) {
      this.assets = await new PresenceActivityAssets(this.client).init({ ...data.assets, applicationId: this.applicationId })
    }

    if (data.emoji) {
      this.emoji = await new ActivityEmoji(this.client).init(data.emoji)
    }

    if (WebSocketUtils.exists(data.flags)) {
      this.flags = new ReadonlyActivityFlagsUtil(data.flags)
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
