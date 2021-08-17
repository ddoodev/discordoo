import { ExtendableEntities as DefaultExtendableEntities } from '@src/entities/ExtendableEntities'
import { Entities } from '@src/entities/Entities'
import { DiscordooError } from '@src/utils'

const ExtendableEntities = Object.create(DefaultExtendableEntities) as typeof DefaultExtendableEntities

type Ext = typeof ExtendableEntities
type Def = typeof DefaultExtendableEntities
type Ent = typeof Entities

const source = 'EntitiesUtil#'

export class EntitiesUtil {

  static extend<K extends keyof Ext = keyof Ext, T extends Ext[K] = Ext[K]>(
    entity: K,
    extender: T | ((base: Ext[K]) => T)
  ): T {

    if (!ExtendableEntities[entity]) {
      throw new DiscordooError(source + 'extend', `Cannot extend entity: ${entity}`)
    }

    const extendableEntity = Entities[entity],
      defaultExtendableEntity = DefaultExtendableEntities[entity]

    if (typeof extender !== 'function') {
      throw new DiscordooError(source + 'extend', 'Extender must be a function')
    }

    if (extender.prototype instanceof extendableEntity || extender.prototype === defaultExtendableEntity.prototype) {
      return Entities[entity] = extender as T
    } else {
      const extended = (extender as (base: Ext[K]) => T)(extendableEntity)

      if (!extended) {
        throw new DiscordooError(source + 'extend', 'Extender returned bad value:', extended)
      }

      if (!(extended.prototype instanceof extendableEntity)) {
        throw new DiscordooError(source + 'extend', 'Extender must return class that extends specified entity')
      }

      return Entities[entity] = extended
    }
  }

  static get<K extends keyof Ent = keyof Ent>(entity: K): Ent[K] {
    if (!Entities[entity]) throw new DiscordooError(source + 'get', 'Unknown entity')
    return Entities[entity]
  }

  static clear<K extends keyof Ext = keyof Ext>(entity: K): Def[K] {
    return EntitiesUtil.extend(entity, DefaultExtendableEntities[entity])
  }

}
