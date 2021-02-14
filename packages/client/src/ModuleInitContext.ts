import Client from './Client'

/**
 * Context passed to module on its initialization
 */
export default interface ModuleInitContext {
  /**
   * Client instance
   */
  client: Client
  // TODO: add here more parameters. Pass Client if there is no other props further
}