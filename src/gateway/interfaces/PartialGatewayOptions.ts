import { Optional } from '@src/utils'
import { GatewayOptions } from './GatewayOptions'

type PartialGatewayOptions = Optional<GatewayOptions, 'intents' | 'properties'>

export default PartialGatewayOptions
