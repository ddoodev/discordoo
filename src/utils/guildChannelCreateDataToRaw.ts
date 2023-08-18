import { GuildChannelCreateData, RawGuildChannelCreateData } from '@src/api'
import { attach } from '@src/utils/attach'

export function guildChannelCreateDataToRaw(data: GuildChannelCreateData): RawGuildChannelCreateData {
    const rawData = {
        name: data.name,
        type: data.type,
        position: data.position,
        topic: data.topic,
        nsfw: data.nsfw,
        bitrate: data.bitrate,
    }

    attach(rawData, data, {
        props: [
            [ 'rateLimitPerUser', 'rate_limit_per_user' ],
            [ 'parentId', 'parent_id' ],
            [ 'permissionOverwrites', 'permission_overwrites' ],
            [ 'userLimit', 'user_limit' ],
            [ 'rtcRegion', 'rtc_region' ],
        ]
    })

    return rawData
}