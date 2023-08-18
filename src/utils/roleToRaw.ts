import { RawRoleCreateData, RoleCreateData } from '@src/api'
import { attach } from '@src/utils/attach'

export function roleToRaw(data: RoleCreateData): RawRoleCreateData {
  const rawData = {
    name: data.name,
    hoist: data.hoist,
    mentionable: data.mentionable,
  }

  attach(rawData, data, {
    props: [
      'permissions',
      'color',
      'icon',
      [ 'unicodeEmoji', 'unicode_emoji' ],
    ]
  })

  return rawData
}