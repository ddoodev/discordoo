import { Message, MessageData, RawMessageData } from '@src/api'
import { RawMessageReferenceData } from '@src/api/entities/message/interfaces/RawMessageReferenceData'
import { MessageReferenceData } from '@src/api/entities/message/interfaces/MessageReferenceData'

export type MessageReferenceResolvable = Message | MessageData | RawMessageData | RawMessageReferenceData | MessageReferenceData
