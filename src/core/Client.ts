import { ListenerSignature, TypedEmitter } from 'tiny-typed-emitter'
import ModuleManager from '@src/core/modules/ModuleManager'
import Module from '@src/core/modules/Module'
import RESTProvider from '@src/core/providers/rest/RESTProvider'
import CacheProvider from '@src/core/providers/cache/CacheProvider'
import DefaultClientStack from '@src/core/DefaultClientStack'

/** Entry point for all of Discordoo. Manages modules and events */
export default class Client<
  ClientStack extends DefaultClientStack = DefaultClientStack
  > extends TypedEmitter<ListenerSignature<ClientStack['events']>> {
  /** Token used by this client */
  public token: string

  constructor(token: string) {
    super()
    this.token = token
  }

  /** Module manager of this client */
  modules: ModuleManager = new ModuleManager(this)

  /** RESTProvider used by this module */
  rest: RESTProvider<ClientStack['rest']> | null = null

  /** CacheProvider used by this module */
  cache: CacheProvider<ClientStack['cache']> | null = null

  /**
   * Get a module. Alias for module(id).
   * @param id - module id
   */
  m(id: string | symbol): Module | null {
    return this.module(id)
  }

  /**
   * Get a module
   * @param id - module id
   */
  module(id: string | symbol): Module | null {
    return this.modules.getModule(id) ?? null
  }

  /**
   * Create a new module load group
   * @param modules - modules in the group
   */
  use(...modules: Module[]) {
    this.modules.use(...modules)
  }

  /**
   * Set the {@link RESTProvider} to be used by this client
   * Bounds it's context to {@link Client}
   * @param provider - function, that returns desired RESTProvider
   */
  useRESTProvider(provider: (client: Client) => RESTProvider<ClientStack['rest']>) {
    this.rest = provider(this).bind(this)
  }

  /**
   * Set the {@link CacheProvider} to be used by this client
   * Bounds it's context to {@link Client}
   * @param provider - function, that returns desired CacheProvider
   */
  useCacheProvider(provider: (client: Client) => CacheProvider<ClientStack['cache']>) {
    this.cache = provider(this).bind(this)
  }

}
