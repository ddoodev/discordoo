import { Presence, PresenceUpdateData } from '@src/api'
import { Client } from '@src/core'

export async function makeCompletedPresence(data: PresenceUpdateData, client: Client): Promise<Required<PresenceUpdateData>> {
  const currentPresences = await client.user.presences()
  const currentPresence: Presence | undefined = currentPresences[0]

  const presence: Required<PresenceUpdateData> = {
    status: data.status ?? client.options.gateway?.presence?.status ?? currentPresence?.status ?? 'online',
    afk: data.afk ?? client.options.gateway?.presence?.afk ?? false,
    activities: data.activities ?? client.options.gateway?.presence?.activities ?? currentPresence.activities ?? [],
    since: typeof data.since === 'undefined' ? client.options.gateway?.presence?.since ?? null : data.since
  }

  if (client.options.gateway?.presence) {
    client.options.gateway.presence = presence
    client.internals.gateway.options.presence = presence
  }
  client.internals.gateway.options.presence = presence

  return presence
}