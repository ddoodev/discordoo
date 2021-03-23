import RequestBuilder from './RequestBuilder'

export default interface RestModuleEvents {
  request: (request: RequestBuilder) => void | Promise<void>
}