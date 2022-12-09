/* Child sharding manager modes (used on a remote machines when 'machines' sharding mode is used) **/
export enum PartialShardingModes {
  /** Spawn sharding instances in different processes */
  Processes = 'processes',
  /** Spawn sharding instances in different worker threads */
  Workers = 'workers',
  /** Spawn sharding instances in different clusters */
  Clusters = 'clusters',
}
