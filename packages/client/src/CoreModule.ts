import Module from './Module'

/**
 * Represents a single CoreModule
 */
export default interface CoreModule extends Module {
  isCore: true // assigning true as only available value
  type: 'gateway' | 'rest' | 'cache' // removing third-party option
}