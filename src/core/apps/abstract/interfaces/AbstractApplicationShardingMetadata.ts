export interface AbstractApplicationShardingMetadata {
  instance: number
  active: boolean
  INSTANCE_IPC: string
  MANAGER_IPC: string
}
