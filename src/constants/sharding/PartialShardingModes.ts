/* Child sharding manager modes (used on a remote machines when 'machines' sharding mode is used) **/
export enum PartialShardingModes {
  /** Spawn sharding instances in different processes */
  PROCESSES = 'processes',
  /** Spawn sharding instances in different worker threads */
  WORKERS = 'workers',
  /** Spawn sharding instances in different node.js's clusters */
  CLUSTERS = 'clusters',
}
