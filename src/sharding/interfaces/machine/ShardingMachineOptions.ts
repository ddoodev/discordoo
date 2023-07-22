import { ShardListResolvable } from '../../../../src/utils/interfaces/ShardListResolvable'
import { ChildShardingManagerOptions } from '../../../../src/sharding/interfaces/manager/options/ChildShardingManagerOptions'
import { IpcClientTlsOptions } from '../../../../src/sharding/interfaces/ipc/IpcClientTlsOptions'

export interface ShardingMachineOptions {
  port?: number
  host: string
  udp?: 'udp4' | 'udp6'
  shards: ShardListResolvable
  tls?: IpcClientTlsOptions
  childManagerOptions: ChildShardingManagerOptions
}
