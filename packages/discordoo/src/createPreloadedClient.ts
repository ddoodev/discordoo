import Client, { Module } from '@discordoo/client'

/**
 * Returns a new client class which has preloaded modules
 * @param modules
 */
export default function createPreloadedClient(...modules: Module[]): typeof Client {
  return class extends Client {
    constructor() {
      super()
      this.moduleLoader.use(...modules)
    }
  }
}