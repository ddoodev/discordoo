import { CacheManagerOperationOptions } from '../../../src/cache/interfaces/CacheManagerOperationOptions'
import { CacheStorageKey } from '../../../../providers/src/_index'

export interface CacheManagerSetOptions extends CacheManagerOperationOptions {
  storage?: CacheStorageKey
}
