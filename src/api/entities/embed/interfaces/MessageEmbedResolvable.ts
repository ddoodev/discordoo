import { MessageEmbed, MessageEmbedData, RawMessageEmbedData } from '@src/api/entities/embed'
import { MessageEmbedBuilder } from '@src/api/entities/embed/MessageEmbedBuilder'

export type MessageEmbedResolvable = MessageEmbed | MessageEmbedBuilder | MessageEmbedData | RawMessageEmbedData
