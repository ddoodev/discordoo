import RequestBuilder from './RequestBuilder'

/**
 * Represents a RESTProvider. Bound to Client context.
 */
type RESTProvider = () => RequestBuilder | Promise<RequestBuilder>
export default RESTProvider