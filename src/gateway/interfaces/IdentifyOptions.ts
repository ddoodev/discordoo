import { GatewayOptions } from '@src/gateway'

export default interface IdentifyOptions extends GatewayOptions {
  forceResume?: boolean
}
