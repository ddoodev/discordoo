import { MessageReaction } from '@src/api/entities/reaction/MessageReaction'
import { MessageReactionData } from '@src/api/entities/reaction/interfaces/MessageReactionData'

export type MessageReactionResolvable = MessageReaction | MessageReactionData
