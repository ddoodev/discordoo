import { AbstractComponentInteractionData } from '@src/api/entities/interaction/interactions/components/AbstractComponentInteractionData'
import { ComponentTypes } from '@src/constants'
import { attach } from '@src/utils'
import { EntityInitOptions, InteractionResolvedCacheManager, Json, RawSelectComponentInteractionData, ToJsonProperties } from '@src/api'

export class SelectMenuInteractionData extends AbstractComponentInteractionData {
  declare type: Exclude<ComponentTypes, ComponentTypes.Button | ComponentTypes.ActionRow>
  declare resolved: InteractionResolvedCacheManager
  declare values: string[]

  async init(data: RawSelectComponentInteractionData & { guildId?: string }, options?: EntityInitOptions): Promise<this> {
    await super.init(data, options)

    attach(this, data, {
      props: [
        'values'
      ],
      disabled: options?.ignore,
    })

    if (data.resolved) {
      this.resolved = await new InteractionResolvedCacheManager(this.app).init(
        { ...data.resolved, guildId: data.guildId }
      )
    }

    return this
  }

  jsonify(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.jsonify({
      ...properties,
      values: true
    }, obj)
  }
}
