import RequestOptions from './RequestOptions'

export default interface RequestBuilder {
  guilds(id?: string): RequestBuilder
  auditLogs(): RequestBuilder
  channels(id?: string): RequestBuilder
  messages(id?: string): RequestBuilder
  crosspost(): RequestBuilder
  reactions(emoji?: string, user?: string): RequestBuilder
  bulkDelete(): RequestBuilder
  permissions(id: string): RequestBuilder
  invites(code: string): RequestBuilder
  pins(id?: string): RequestBuilder
  typing(): RequestBuilder
  followers(): RequestBuilder
  recipients(id: string): RequestBuilder
  emojis(id?: string): RequestBuilder
  preview(): RequestBuilder
  members(id?: string): RequestBuilder
  nick(): RequestBuilder
  roles(id?: string): RequestBuilder
  bans(id?: string): RequestBuilder
  prune(): RequestBuilder
  regions(): RequestBuilder
  integrations(id?: string): RequestBuilder
  sync(): RequestBuilder
  widget(): RequestBuilder
  widgetJson(): RequestBuilder
  widgetPng(): RequestBuilder
  vanityUrl(): RequestBuilder
  templates(code?: string): RequestBuilder
  users(id: string): RequestBuilder
  connections(): RequestBuilder
  voice(): RequestBuilder
  webhooks(id?: string, token?: string): RequestBuilder
  slack(): RequestBuilder
  github(): RequestBuilder
  gateway(bot: boolean): RequestBuilder
  get(options: RequestOptions): Record<string, any>
  post(options: RequestOptions): Record<string, any>
  put(options: RequestOptions): Record<string, any>
  patch(options: RequestOptions): Record<string, any>
  delete(options: RequestOptions): Record<string, any>
  v(version: 6 | 8): RequestBuilder
}