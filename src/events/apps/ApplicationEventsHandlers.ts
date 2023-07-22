import { GatewayApplicationEventsHandlers } from '@src/events/apps/GatewayApplicationEventsHandlers'
import { RestApplicationEventsHandlers } from '@src/events/apps/RestApplicationEventsHandlers'

/** DiscordApplication events */
export type ApplicationEventsHandlers = GatewayApplicationEventsHandlers & RestApplicationEventsHandlers