import { CompletedGatewayOptions } from '../../../../src/gateway'
import { CompletedRestApplicationOptions } from '../../../../src/core'

export interface CompletedApplicationOptions extends CompletedRestApplicationOptions {
  gateway: CompletedGatewayOptions
}