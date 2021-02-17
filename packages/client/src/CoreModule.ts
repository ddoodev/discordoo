import Module from './Module'

/**
 * Represents a single CoreModule
 */
export default interface CoreModule extends Module {
  type: 'gateway' | 'rest' | 'cache' // removing third-party option
}