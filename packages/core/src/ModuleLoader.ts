import Module from './Module'
import Client from './Client'

export default class ModuleLoader {
  /**
   * Modules loaded by this module
   */
  public modules: Map<string, Module> = new Map()
  /**
   * Client this module belongs to
   */
  public client: Client

  /**
   * @param client - client, which module shall bind to
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * Use module
   * @param modules - array of modules
   */
  use(...modules: Module[]): void {
    if(modules.length == 0) throw new Error('No modules were provided to ModuleLoader#use')
    for(const module of modules) {
      const id = module.isCore ? module.type : module.id
      if([ ...this.modules.keys() ].includes(id)) {
        this.modules.get(id)?.destroyed?.(this.client)
      }
      this.modules.set(id, module)
    }
  }

  /**
   * Initialize all modules
   *
   * @param async - load all modules in parallel or not
   */
  async initAllModules(async: boolean): Promise<void> {
    if (async) {
      const promises = [ ...this.modules.values() ].map((e: Module) => e?.init?.({ client: this.client }))
      await Promise.all(promises)
    } else {
      for (const m of this.modules.values()) {
        await m?.init?.({ client: this.client })
      }
    }
  }
}