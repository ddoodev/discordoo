/** Gateway connection properties */
export interface GatewayIdentifyProperties {
  /**
   * Operating system
   * @default process.platform
   * */
  $os: string
  /**
   * Discord library name
   * @default Discordoo
   * */
  $browser: string
  /**
   * Discord library name
   * @default Discordoo
   * */
  $device: string
}