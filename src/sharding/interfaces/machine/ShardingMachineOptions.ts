import ShardListResolvable from '@src/core/ShardListResolvable'
import ChildShardingManagerOptions from '@src/sharding/interfaces/manager/options/ChildShardingManagerOptions'
import IpcClientTlsOptions from '@src/sharding/interfaces/ipc/IpcClientTlsOptions'

export default interface ShardingMachineOptions {
  port?: number
  host: string
  udp?: 'udp4' | 'udp6'
  shards: ShardListResolvable
  tls?: IpcClientTlsOptions
  childManagerOptions: ChildShardingManagerOptions
}
