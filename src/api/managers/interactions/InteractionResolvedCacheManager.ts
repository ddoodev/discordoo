import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { Client } from '@src/core'
import { InteractionResolvedCacheManagerData } from '@src/api/managers/interactions/InteractionResolvedCacheManagerData'
import { is } from 'typescript-is'
import { ValidationError } from '@src/utils'
import { EntitiesCacheManager, GuildMember, Message, Role, User } from '@src/api'
import { AnyGuildChannel } from '@src/api/entities/channel/interfaces/AnyGuildChannel'
import { KNOWN_CACHE_OPERATE_METHODS, ProxyFilterPointerSymbol } from '@src/constants'

export class InteractionResolvedCacheManager extends EntitiesManager {
  private readonly _data: InteractionResolvedCacheManagerData

  public channels: EntitiesCacheManager<AnyGuildChannel>
  public messages: EntitiesCacheManager<Message>
  public members: EntitiesCacheManager<GuildMember>
  public roles: EntitiesCacheManager<Role>
  public users: EntitiesCacheManager<User>

  constructor(client: Client, data: InteractionResolvedCacheManagerData) {
    super(client)

    if (!is<InteractionResolvedCacheManagerData>(data)) {
      throw new ValidationError(
        'InteractionResolvedManager',
        'Invalid init data provided. Type InteractionResolvedCacheManagerData is incompatible with the provided data.'
      )._setInvalidOptions(data)
    }

    this._data = data

    const makePredicate = (allowed: string[], predicate: any, isMap?: boolean) => {
      return (value, key, prov) => {
        if (allowed.includes(key)) {
          return predicate(value, key, prov)
        } else {
          if (isMap) return ProxyFilterPointerSymbol
          else return false
        }
      }
    }

    const clear = (storage: string, name: string) => {
      if (this._data[name]?.length) {
        this._data[name] = []
        this[name] = new Proxy<EntitiesCacheManager<any>>(
          this.client[name].cache, makeProxyHandler([], storage, name)
        )
      }
    }

    const allow = (key: string, name: string) => {
      if (this._data[name]?.length) {
        this._data[name].push(key)
      }
    }

    const makeProxyHandler = (allowed: string[], storage: string, name: string) => {
      return {
        get(target: EntitiesCacheManager<any>, p: string | symbol): any {
          if (KNOWN_CACHE_OPERATE_METHODS.includes(p as any)) {
            return async function (...args: any[]) { // async to return promise
              switch (p as typeof KNOWN_CACHE_OPERATE_METHODS[number]) {
                case 'count':
                  return target.count(makePredicate(allowed, args[0]), { ...args[1], storage })
                case 'counts':
                  return target.counts(args[0]?.map(a => makePredicate(allowed, a[0])), { ...args[1], storage })
                case 'filter':
                  return target.filter(makePredicate(allowed, args[0]), { ...args[1], storage })
                case 'find':
                  return target.find(makePredicate(allowed, args[0]), { ...args[1], storage })
                case 'forEach':
                  return target.forEach(makePredicate(allowed, args[0]), { ...args[1], storage })
                case 'map':
                  return target.map(makePredicate(allowed, args[0], true), { ...args[1], storage })
                    .then(r => r.filter(v => v !== ProxyFilterPointerSymbol))
                case 'sweep':
                  return target.sweep(makePredicate(allowed, args[0]), { ...args[1], storage })
                case 'get':
                  return allowed.includes(args[0]) ? target.get(args[0], { ...args[1], storage }) : undefined
                case 'has':
                  return allowed.includes(args[0]) ? target.has(args[0], { ...args[1], storage }) : undefined
                case 'delete':
                  return allowed.includes(args[0]) ? target.delete(args[0], { ...args[1], storage }) : undefined
                case 'set':
                  return target.set(args[0], args[1], { ...args[2], storage })
                    .then(() => {
                      allow(args[0], name); return target
                    })
                case 'size':
                  return target.count(makePredicate(allowed, () => true), { ...args[0], storage })
                case 'clear':
                  return clear(storage, name)
                case 'keys':
                  return allowed
                case 'entries':
                  return target.entries({ ...args[0], storage })
                    .then(r => r.filter(k => allowed.includes(k[0])))
                case 'values':
                  return Promise.all(allowed.map(k => target.get(k, { ...args[0], storage })))
              }
            }
          } else {
            return target[p]
          }
        }
      }
    }

    const guildId = data.guildId,
      channelId = data.channelId

    this.channels = new Proxy<EntitiesCacheManager<any>>(
      this.client.channels.cache, makeProxyHandler(this._data.channels ?? [], guildId ?? 'global', 'channels')
    )

    this.roles = new Proxy<EntitiesCacheManager<any>>(
      this.client.roles.cache, makeProxyHandler(this._data.roles ?? [], guildId ?? 'global', 'roles')
    )

    this.members = new Proxy<EntitiesCacheManager<any>>(
      this.client.members.cache, makeProxyHandler(this._data.members ?? [], guildId ?? 'global', 'members')
    )

    this.messages = new Proxy<EntitiesCacheManager<any>>(
      this.client.messages.cache, makeProxyHandler(this._data.members ?? [], channelId ?? 'global', 'channels')
    )

    this.users = new Proxy<EntitiesCacheManager<any>>(
      this.client.users.cache, makeProxyHandler(this._data.members ?? [], 'global', 'users')
    )
  }

}