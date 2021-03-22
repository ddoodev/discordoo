import Client from '../Client'

export default interface Module {
  initialized: boolean
  init?: (client: Client) => Promise<void> | void
  destroyed?: () => Promise<void> | void
  id: string | symbol
}