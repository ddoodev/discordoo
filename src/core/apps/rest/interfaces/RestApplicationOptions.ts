import { CacheApplicationOptions } from '../../../../../src/core'
import { RestOptions } from '../../../../../src/rest'

export interface RestApplicationOptions<CustomOptions = any> extends CacheApplicationOptions<CustomOptions> {
  rest?: RestOptions
  custom?: CustomOptions
}