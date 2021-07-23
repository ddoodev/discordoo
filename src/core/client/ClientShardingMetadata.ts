export interface ClientShardingMetadata {
  instance: number
  shards: number[]
  active: boolean
  totalShards: number
  INSTANCE_IPC: string
  MANAGER_IPC: string
}
