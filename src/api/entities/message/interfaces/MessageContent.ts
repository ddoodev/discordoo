import { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'

export type MessageContent = /* MessageEmbed */ any | MessageAttachment | string | number | Buffer
