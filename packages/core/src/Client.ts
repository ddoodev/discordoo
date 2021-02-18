import ModuleLoader from './modules/ModuleLoader'
import Module from './modules/Module'

export default class Client {
  public moduleLoader: ModuleLoader = new ModuleLoader(this)

  get modules(): Map<string, Module> {
    return this.moduleLoader.modules
  }

  get use(): (...modules: Module[]) => void {
    return this.moduleLoader.use
  }

  $(moduleName: string): Module | undefined {
    return this.modules.get(moduleName)
  }

  get getModule() {
    return this.$
  }

  async start(async = false) {
    await this.moduleLoader.initAllModules(async)
  }
}