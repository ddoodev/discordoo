import { Optional } from '@src/utils'
import { GatewayOptions } from './GatewayOptions'

export type PartialGatewayOptions = Optional<GatewayOptions, 'intents' | 'properties'>
