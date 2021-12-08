/** Sharding manager modes */
export enum ShardingModes {
  /** Spawn sharding instances in different processes */
  PROCESSES = 'processes',
  /** Spawn sharding instances in different worker threads */
  WORKERS = 'workers',
  /** Spawn sharding instances in different clusters */
  CLUSTERS = 'clusters',
  /**
   * Connect to child sharding managers in different machines and pass sharding instructions to them.
   * NOT SUPPORTED YET. WILL BE INTRODUCED IN VERSION 1.2
   * */
  MACHINES = 'machines',
}
