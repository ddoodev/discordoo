import ModuleLoader from './ModuleLoader'
import Module from './Module'

export default class Client {
  public moduleLoader: ModuleLoader = new ModuleLoader(this)

  get modules(): Map<string, Module> {
    return this.moduleLoader.modules
  }

  get use(): (...modules: Module[]) => void {
    return this.moduleLoader.use
  }

  async start(async = false) {
    await this.moduleLoader.initAllModules(async)
  }
}