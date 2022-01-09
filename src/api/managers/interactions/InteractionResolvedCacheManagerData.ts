import { RawInteractionResolvedData } from '@src/api/entities/interaction/interfaces/RawInteractionResolvedData'

export type InteractionResolvedCacheManagerData = { guildId?: string; channelId?: string } & RawInteractionResolvedData
