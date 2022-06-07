import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { AbstractGuildData } from '@src/api/entities/guild/interfaces/AbstractGuildData'
import { Json, ToJsonProperties } from '@src/api'
import { GuildFeatures } from '@src/constants'
import { attach, idToDate, idToTimestamp, ImageUrlOptions } from '@src/utils'

export class AbstractGuild extends AbstractEntity implements AbstractGuildData {
  public declare features: GuildFeatures[]
  public icon?: string
  public declare id: string
  public declare name: string

  async init(data: AbstractGuildData): Promise<this> {
    attach(this, data, {
      props: [
        'features',
        'icon',
        'id',
        'name'
      ]
    })

    return this
  }

  get createdTimestamp(): number {
    return idToTimestamp(this.id)
  }

  get createdDate(): Date {
    return idToDate(this.id)
  }

  get partnered(): boolean {
    return !!this.features?.includes(GuildFeatures.PARTNERED)
  }

  get verified(): boolean {
    return !!this.features?.includes(GuildFeatures.VERIFIED)
  }

  get discoverable(): boolean {
    return !!this.features?.includes(GuildFeatures.DISCOVERABLE)
  }

  get nameAcronym(): string {
    return this.name.replace(/('s )|\w+|\s/g, (substring) => {
      switch (substring) {
        case ' ':
        case '\'s ': // discord for some reason replaces ('s )
          return ''
        default:
          return substring[0]
      }
    })
  }

  iconUrl(options?: ImageUrlOptions): string | undefined {
    return this.icon ? this.client.internals.rest.cdn.icon(this.id, this.icon, options) : undefined
  }

  toString() {
    return this.name
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      features: true,
      icon: true,
      id: true,
      name: true,
    }, obj)
  }

}