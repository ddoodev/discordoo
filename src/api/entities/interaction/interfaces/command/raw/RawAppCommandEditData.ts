import { RawAppCommandCreateData } from '@src/api'

export type RawAppCommandEditData = Partial<Omit<RawAppCommandCreateData, 'type'>>
