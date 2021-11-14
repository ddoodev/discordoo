import { CompletedLocalIpcOptions } from '@src/constants/sharding/CompletedLocalIpcOptions'
import os from 'os'

export const LOCAL_IPC_DEFAULT_OPTIONS: CompletedLocalIpcOptions = {
  appspace: 'ddoo',
  encoding: 'utf8',
  socketRoot: os.platform() === 'win32' ? '\\\\\\\\.\\\\pipe\\\\\\tmp\\' : '/tmp/',
  logDepth: 5,
  logger: msg => undefined // console.log(msg) // TODO
}
