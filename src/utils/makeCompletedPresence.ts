import { Presence, PresenceUpdateData } from '../../src/api'
import { DiscordApplication } from '../../src/core'

export async function makeCompletedPresence(data: PresenceUpdateData, app: DiscordApplication): Promise<Required<PresenceUpdateData>> {
  const currentPresences = await app.user.presences()
  const currentPresence: Presence | undefined = currentPresences[0]

  const presence: Required<PresenceUpdateData> = {
    status: data.status ?? app.options.gateway?.presence?.status ?? currentPresence?.status ?? 'online',
    afk: data.afk ?? app.options.gateway?.presence?.afk ?? false,
    activities: data.activities ?? app.options.gateway?.presence?.activities ?? currentPresence.activities ?? [],
    since: typeof data.since === 'undefined' ? app.options.gateway?.presence?.since ?? null : data.since
  }

  if (app.options.gateway?.presence) {
    app.options.gateway.presence = presence
    app.internals.gateway.options.presence = presence
  }
  app.internals.gateway.options.presence = presence

  return presence
}