import { Message, MessageData, RawMessageData } from '@src/api'
import { Resolvable } from '@src/api/entities/interfaces/Resolvable'

export type MessageResolvable = Resolvable<Message | MessageData | RawMessageData>
