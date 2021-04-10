import RequestBuilder from './RequestBuilder'

/** Represents a RESTProvider. Bound to Client context */
type RESTProvider<T extends RequestBuilder = RequestBuilder> = () => T

export default RESTProvider
