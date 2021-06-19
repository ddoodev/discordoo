import { IpcTlsOptions } from '@src/sharding'

type IpcClientTlsOptions = Omit<IpcTlsOptions, 'dhparam' | 'requestCert'>

export default IpcClientTlsOptions
