import { IgnoreAllSymbol } from '@src/constants'

export interface EntityInitOptions {
  ignore?: Array<string | typeof IgnoreAllSymbol>
}