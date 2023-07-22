import { CompletedRestOptions } from '../../../../../src/rest'
import { CompletedCacheApplicationOptions } from '../../../../../src/core'

export interface CompletedRestApplicationOptions extends CompletedCacheApplicationOptions {
  rest: CompletedRestOptions
}