export enum ShardingModes {
    /** Spawn sharding instances in different processes */
    Processes = "processes",
    /** Spawn sharding instances in different worker threads */
    Workers = "workers",
    /** Spawn sharding instances in different clusters */
    Clusters = "clusters",
    /**
     * Connect to child sharding managers in different machines and pass sharding instructions to them.
     * NOT SUPPORTED YET. WILL BE INTRODUCED IN VERSION 1.2
     * */
    Machines = "machines"
}
