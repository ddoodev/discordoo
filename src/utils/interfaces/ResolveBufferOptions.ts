export interface ResolveBufferOptions {
  /**
   * DANGEROUS: AUTOMATICALLY DOWNLOADS THE FILE FROM THE SPECIFIED Link.
   * If you enable this, I sure hope you know what you are doing.
   * */
  fetch?: boolean
  /**
   * Options to use when downloading the file.
   * */
  fetchOptions?: RequestInit
}
