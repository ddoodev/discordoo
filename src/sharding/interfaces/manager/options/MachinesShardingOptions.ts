import ShardingMachineOptions from '@src/sharding/interfaces/machine/ShardingMachineOptions'
import { IpcTlsOptions } from '@src/sharding'

export default interface MachinesShardingOptions {
  me: 'parent' | 'child'
  points?: ShardingMachineOptions[]
  tls?: IpcTlsOptions
}
