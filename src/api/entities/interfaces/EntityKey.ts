import { Entities } from '@src/api/entities'

export type EntityKey = ((data: any) => keyof typeof Entities) | keyof typeof Entities
