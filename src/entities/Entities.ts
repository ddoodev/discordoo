import { ExtendableEntities as DefaultExtendableEntities } from '@src/entities/ExtendableEntities'
import { DiscordooError } from '@src/utils'

const ExtendableEntities = Object.create(DefaultExtendableEntities) as typeof DefaultExtendableEntities

type Extendable<X extends { [k: string]: abstract new (...args: any) => any }> = {
  [D in keyof X]: X[D]
}
type E = Extendable<typeof ExtendableEntities>
type D = Extendable<typeof DefaultExtendableEntities>

const source = 'Entities#'

export class Entities {

  static extend<K extends keyof E = keyof E, T extends E[K] = E[K]>(
    entity: K,
    extender: T | ((base: E[K]) => T)
  ): T {

    if (!ExtendableEntities[entity]) {
      throw new DiscordooError(source + 'extend', `Cannot extend entity: ${entity}`)
    }

    const extendableEntity = ExtendableEntities[entity],
      defaultExtendableEntity = DefaultExtendableEntities[entity]

    if (typeof extender !== 'function') {
      throw new DiscordooError(source + 'extend', 'Extender must be a function')
    }

    if (extender.prototype instanceof extendableEntity || extender.prototype === defaultExtendableEntity.prototype) {
      return ExtendableEntities[entity] = extender as T
    } else {
      const extended = (extender as (base: E[K]) => T)(extendableEntity)

      if (!extended) {
        throw new DiscordooError(source + 'extend', 'Extender returned bad value:', extended)
      }

      if (!(extended.prototype instanceof extendableEntity)) {
        throw new DiscordooError(source + 'extend', 'Extender must return class that extends specified entity')
      }

      return ExtendableEntities[entity] = extended
    }
  }

  static get<K extends keyof E = keyof E>(entity: K): E[K] {
    if (!ExtendableEntities[entity]) throw new DiscordooError(source + 'get', 'Unknown entity')
    return ExtendableEntities[entity]
  }

  static clear<K extends keyof E = keyof E>(entity: K): D[K] {
    return Entities.extend(entity, DefaultExtendableEntities[entity])
  }

}
