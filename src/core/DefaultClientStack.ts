import CacheNamespace from '@src/core/providers/cache/CacheNamespace'
import RequestBuilder from '@src/core/providers/rest/RequestBuilder'
import ClientEventsHandlers from '@src/core/ClientEventsHandlers'
import { GatewayProviderUtils } from '@src/core/providers/gateway/GatewayProvider'

export default interface DefaultClientStack {
  cache: CacheNamespace
  rest: RequestBuilder
  events: ClientEventsHandlers,
  gateway: GatewayProviderUtils
}
