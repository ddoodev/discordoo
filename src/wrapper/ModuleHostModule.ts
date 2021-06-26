import { Client, Module } from '@src/core'

/** Module which is capable of loading other modules */
export class ModuleHostModule implements Module {
  id: string | symbol = 'host-module'
  initialized = false

  /** Modules which will be loaded by this module */
  modules: Module[] = []

  /**
   * @param modules - modules to load
   */
  constructor(modules: Module[]) {
    this.modules = modules
  }

  init(client: Client) {
    client.use(...this.modules)
    this.initialized = true
  }
}
