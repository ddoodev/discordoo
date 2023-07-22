import { Entities } from '@src/api/entities/Entities'
import { EntityKeyFunctions } from '@src/api/entities/EntityKeyFunctions'

export type EntityKey = keyof typeof Entities | 'any' | keyof typeof EntityKeyFunctions
