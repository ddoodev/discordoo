/**
 * List of cache operate methods that user can perform.
 * Used in proxies for cache managers
 * */
export const KNOWN_CACHE_OPERATE_METHODS = [
  'get',
  'set',
  'forEach',
  'delete',
  'size',
  'has',
  'sweep',
  'filter',
  'map',
  'find',
  'clear',
  'count',
  'counts',
  'keys',
  'values',
  'entries'
] as const