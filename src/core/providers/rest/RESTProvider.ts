import { RequestBuilder } from '@src/core/providers/rest/RequestBuilder'

/** Represents a RESTProvider. Bound to Client context */
export type RESTProvider<T extends RequestBuilder = RequestBuilder> = () => T
