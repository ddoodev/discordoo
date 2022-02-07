/** Sharding mode 'clusters' incompatible with Windows socket. Only UNIX socket supported. */
export const CLUSTERS_SHARDING_UNSUPPORTED_PLATFORMS = [
  'win32',
  'cygwin',
] as const
