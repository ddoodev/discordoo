import type { MessageAttachment } from '@src/api/entities/attachment/MessageAttachment'
import type { MessageEmbed } from '@src/api/entities/embed'
import type { MessageSticker } from '@src/api/entities/sticker'

export type MessageContent = MessageEmbed | MessageAttachment | MessageSticker | string | number | Buffer
