import { AnyChannel, AnyRawChannelData } from '@src/api'
import { attach } from '@src/utils/attach'

export function channelToRaw(data: AnyChannel): AnyRawChannelData {
    const rawData = {
        id: data.id,
        type: data.type
    }

    attach(rawData, data, {
        props: [
            'name',
            'position',
            'nsfw',
            'recipients',
            [ 'guildId', 'guild_id' ],
            [ 'parentId', 'parent_id' ],
            [ 'permissionOverwrites', 'permission_overwrites' ],
            [ 'rateLimitPerUser', 'rate_limit_per_user' ],
            [ 'lastMessageId', 'last_message_id' ],
            [ 'lastPinTimestamp', 'last_pin_timestamp' ],
            [ 'defaultAutoArchiveDuration', 'default_auto_archive_duration' ],
            'topic',
            'deleted'
        ]
    })

    return rawData as AnyRawChannelData
}