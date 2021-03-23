import Module from '../Module'
import RequestBuilder from './RequestBuilder'
import { TypedEmitter } from 'tiny-typed-emitter'
import RestModuleEvents from './RestModuleEvents'

/**
 * Represents a rest module
 */
export default interface RestModule extends Module, TypedEmitter<RestModuleEvents> {
  /**
   * Create a new request
   */
  request(): RequestBuilder
}