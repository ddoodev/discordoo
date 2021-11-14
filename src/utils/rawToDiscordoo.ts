import { EventNames } from '@src/constants'

export function rawToDiscordoo(event: string) {
  return EventNames[event] ?? event
}
