import { EventsNames } from '@src/constants'

export function rawToDiscordoo(event: string) {
  return EventsNames[event]
}
