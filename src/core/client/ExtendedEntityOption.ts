import { ExtendableEntities } from '@src/api'

type Ext = typeof ExtendableEntities

export interface ExtendedEntityOption<K extends keyof Ext = keyof Ext, T extends Ext[K] = Ext[K]> {
  entity: K
  extender: T | ((base: Ext[K]) => T)
}
