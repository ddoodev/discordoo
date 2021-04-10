import CacheNamespace from '@src/core/providers/cache/CacheNamespace'
import RequestBuilder from '@src/core/providers/rest/RequestBuilder'
import ClientEventsHandlers from '@src/core/ClientEventsHandlers'

export default interface DefaultClientStack {
  cache: CacheNamespace
  rest: RequestBuilder
  events: ClientEventsHandlers
}
