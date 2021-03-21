import Client from '../Client'
import Collection from '../../collection'
import Module from './Module'

export default class ModuleManager {
  modules: Collection<string | symbol, Module> = new Collection
  private _moduleLoadGroups: (Module[])[] = []

  constructor(public client: Client) {}

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
   *
   * @param modules - modules to add to a new load group
   */
  use(...modules: Module[]) {
    this.createLoadGroup(...modules)
  }

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

  getModule(id: string | symbol) {
    return this.modules.get(id)
  }
}