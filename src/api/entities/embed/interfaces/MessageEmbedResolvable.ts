import { MessageEmbed, MessageEmbedData, RawMessageEmbedData } from '@src/api/entities/embed'
import { MessageEmbedConstructor } from '@src/api/entities/embed/MessageEmbedConstructor'

export type MessageEmbedResolvable = MessageEmbed | MessageEmbedConstructor | MessageEmbedData | RawMessageEmbedData
