/** Roles caching policy */
export enum RolesCachingPolicy {
  /** Cache all roles */
  ALL = 'all',
  /** Dont cache roles */
  NONE = 'none',
  /** Cache @everyone roles */
  EVERYONE = 'everyone',
  /** Cache roles that managed by integrations */
  MANAGED = 'managed',
}
