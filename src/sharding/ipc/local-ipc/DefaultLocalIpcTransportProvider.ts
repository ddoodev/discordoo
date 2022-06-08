import {
  IpcPacketLike,
  IpcShardIdentificationOptions,
  IpcTransportProviderEventCallback,
  LocalIpcTransportProvider
} from '@discordoo/providers'
import { Collection } from '@discordoo/collection'
import { LocalIpcTransportProviderOptions } from '@src/sharding/ipc/LocalIpcTransportProviderOptions'

interface Listener {
  id: string
  callback: IpcTransportProviderEventCallback
}

export class DefaultLocalIpcTransportProvider implements LocalIpcTransportProvider {
  private readonly listeners: Listener[] = []
  private readonly bucket: Collection = new Collection()
  private readonly options: LocalIpcTransportProviderOptions

  private shardNumber = -1
  private shardId = 'unknown'

  private readonly wtfhere

  constructor(options: LocalIpcTransportProviderOptions) {
    this.options = options


  }

  connect(shard: number, identity: IpcShardIdentificationOptions): Promise<void> {
    return Promise.resolve(undefined)
  }

  disconnect(shard: number, identity: IpcShardIdentificationOptions): Promise<void> {
    return Promise.resolve(undefined)
  }

  init(): Promise<unknown> {
    // console.log('инит надо вызывать если что')
    return Promise.resolve(undefined)
  }

  listen(shard: number, id: string): Promise<void> {
    return Promise.resolve()
  }

  send(shard: number, packet: IpcPacketLike): void {
    return
  }

  subscribe(listenerId: string, fn: IpcTransportProviderEventCallback): void {
    return
  }

  unsubscribe(listenerId: string): void {
    return
  }

}