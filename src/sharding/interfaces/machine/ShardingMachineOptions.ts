import ShardListResolvable from '@src/core/ShardListResolvable'
import IpcTlsOptions from '@src/sharding/interfaces/ipc/IpcTlsOptions'
import ChildShardingManagerOptions from '@src/sharding/interfaces/manager/options/ChildShardingManagerOptions'

export default interface ShardingMachineOptions {
  port?: number
  host: string
  udp?: 'udp4' | 'udp6'
  shards: ShardListResolvable
  tls?: IpcTlsOptions
  childManagerOptions: ChildShardingManagerOptions
}
