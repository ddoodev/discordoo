export default interface GatewayModuleConfig {
  token: string,
  // double array for range, array for specific ids, just number for amount of shards
  shards: [number, number] | number[] | number
}
