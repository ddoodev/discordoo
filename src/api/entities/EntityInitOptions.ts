import { IgnoreAllSymbol } from '@src/constants'

export interface EntityInitOptions {
  ignore?: string[] | [ typeof IgnoreAllSymbol ]
}