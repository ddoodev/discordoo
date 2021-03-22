import ClientEventHandlers from './ClientEventHandlers'
import { TypedEmitter } from 'tiny-typed-emitter'
import ModuleManager from './modules/ModuleManager'
import Module from './modules/Module'

/**
 * Entry point for all of Discordoo. Manages modules and events
 */
export default class Client extends TypedEmitter<ClientEventHandlers> {
  /**
   * Module manager of this client
   */
  modules: ModuleManager = new ModuleManager(this)

  /**
   * Get a module. Alias for module(id).
   *
   * @param id - module id
   */
  m(id: string | symbol): Module | null {
    return this.module(id)
  }

  /**
   * Get a module
   *
   * @param id - module id
   */
  module(id: string | symbol): Module | null {
    return this.modules.getModule(id) ?? null
  }

  /**
   * Create a new module load group
   *
   * @param modules - modules in the group
   */
  use(...modules: Module[]) {
    this.modules.use(...modules)
  }
}
