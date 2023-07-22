import { CacheProvider } from '../../../../../../providers/src/_index'
import { AbstractApplicationEventsHandlers } from '../../../../../src/events/apps'

export interface DefaultCacheApplicationStack {
  cache: CacheProvider
  events: AbstractApplicationEventsHandlers
}