import { CompletedGatewayOptions } from '@src/gateway/interfaces/CompletedGatewayOptions'

export interface IdentifyOptions extends CompletedGatewayOptions {
  forceResume?: boolean
}
