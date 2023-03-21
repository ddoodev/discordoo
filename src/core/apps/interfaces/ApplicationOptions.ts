import { RestApplicationOptions } from '@src/core'
import { GatewayOptions } from '@src/gateway'

export interface ApplicationOptions<CustomOptions = any> extends RestApplicationOptions<CustomOptions> {
  gateway?: GatewayOptions
  custom?: CustomOptions
}