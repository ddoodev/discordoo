import { ExtendableEntities as DefaultExtendableEntities } from '@src/api/entities/ExtendableEntities'
import { Entities } from '@src/api/entities/Entities'
import { EntityKeyFunctions } from '@src/api'

export const ExtendableEntitiesUtil = Object.create(DefaultExtendableEntities ?? null) as typeof DefaultExtendableEntities

/* eslint-disable @typescript-eslint/ban-types */
export type Ext = typeof ExtendableEntitiesUtil
export type Def = typeof DefaultExtendableEntities
export type Ent = typeof Entities
export type Enf = typeof EntityKeyFunctions
/* eslint-enable @typescript-eslint/ban-types */