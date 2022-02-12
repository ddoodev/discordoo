import { AnyChannel, DirectMessagesChannel } from '@src/api'

export type AnyGuildChannel = Exclude<AnyChannel, DirectMessagesChannel>
