import { Dispatcher } from 'undici'

export interface ResolveBufferOptions {
  /**
   * DANGEROUS: AUTOMATICALLY DOWNLOADS THE FILE FROM THE SPECIFIED LINK.
   * If you enable this, I sure hope you know what you are doing.
   * */
  fetch?: boolean
  /**
   * Options to use when downloading the file.
   * @see https://undici.nodejs.org/#/./docs/api/Dispatcher?id=parameter-dispatchoptions
   * @see https://undici.nodejs.org/#/./docs/api/Dispatcher?id=parameter-requestoptions
   * */
  fetchOptions?: { dispatcher?: Dispatcher | undefined } & Omit<Dispatcher.RequestOptions, 'origin' | 'path'>
}
