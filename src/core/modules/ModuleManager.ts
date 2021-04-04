import Client from '../Client'
import { Collection } from '../../collection'
import Module from './Module'

/**
 * Module manager for Client
 * Manages module loadment and their "injection"
 */
export default class ModuleManager {
  /**
   * Modules loaded by this manager
   */
  modules: Collection<string | symbol, Module> = new Collection

  /** Array of load groups */
  private _moduleLoadGroups: (Module[])[] = []

  /** Client which uses this manager */
  client: Client

  /**
   * @param client - client, into which modules will be loaded
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * Creates a new load group
   *
   * Load group is a bunch of modules, which will be loaded together sequentially.
   * Groups can be either loaded in parallel or sequentially
   *
   * @param modules - modules to add to a new load group
   */
  createLoadGroup(...modules: Module[]) {
    this._moduleLoadGroups.push(modules)
  }

  /**
   * An alias to ModuleManager#createLoadGroup
   * @param modules - modules to add to a new load group
   */
  use(...modules: Module[]) {
    this.createLoadGroup(...modules)
  }

  /**
   * Initialize all modules
   * @param async - determines if load groups shall be loaded in parallel
   */
  async init(async = false) { // using false by default to avoid some issues
    if (async) {
      const promises = []
      for (const loadGroup of this._moduleLoadGroups) {
        promises.push((async () => {
          for (const module of loadGroup) {
            module.init?.(this.client)
            this.modules.set(module.id, module)
          }
        })())
      }
      await Promise.all(promises)
    } else {
      for (const loadGroup of this._moduleLoadGroups) {
        for (const module of loadGroup) {
          module.init?.(this.client)
          this.modules.set(module.id, module)
        }
      }
    }
  }

  /**
   * Retrieve a module
   * @param id - module's id
   */
  getModule(id: string | symbol) {
    return this.modules.get(id)
  }
}