import Module from './Module'
import Client from './Client'

export default class ModuleLoader {
  /**
   * Modules loaded by this module
   */
  public modules: Record<string, Module> = {}
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
      if(Object.keys(this.modules).includes(id)) {
        this.modules[id].destroyed(this.client)
      }
      this.modules[id] = module
      module.init({ client: this.client })
    }
  }
}