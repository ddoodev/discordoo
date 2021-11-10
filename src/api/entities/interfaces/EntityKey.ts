import { Entities } from '@src/api/entities/Entities'

export type EntityKey = ((data: any) => keyof typeof Entities) | keyof typeof Entities | 'any'
