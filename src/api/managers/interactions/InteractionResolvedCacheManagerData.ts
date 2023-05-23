import { RawInteractionResolvedData } from '@src/api'

export type InteractionResolvedCacheManagerData = { guildId?: string; channelId?: string } & RawInteractionResolvedData
