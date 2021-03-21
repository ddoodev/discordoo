import ClientEventHandlers from './ClientEventHandlers'
import { TypedEmitter } from 'tiny-typed-emitter'
import ModuleManager from './modules/ModuleManager'
import Module from './modules/Module'

class Client extends TypedEmitter<ClientEventHandlers> {
  modules: ModuleManager = new ModuleManager(this)

  $(id: string | symbol): Module | null {
    return this.modules.getModule(id) ?? null
  }

  use(...modules: Module[]) {
    this.modules.use(...modules)
  }
}

// exporting this one seperately because yes
export default Client