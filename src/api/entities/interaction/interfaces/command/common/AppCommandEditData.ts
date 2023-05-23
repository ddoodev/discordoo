import { AppCommandCreateData } from '@src/api'

export type AppCommandEditData = Partial<Omit<AppCommandCreateData, 'type'>>
