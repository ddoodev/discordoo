import { GatewayConnectionOptions } from '../../src/gateway/interfaces/GatewayOptions'

export function makeConnectionUrl(options: GatewayConnectionOptions, urlOverride?: string): string {
  return (urlOverride ?? options.url)
    + '/?v=' + options.version
    + '&encoding=' + options.encoding
    + (options.compress ? '&compress=zlib-stream' : '')
}