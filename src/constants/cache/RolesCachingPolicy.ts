/** Roles caching policy */
export enum RolesCachingPolicy {
  /** Cache all roles */
  All = 'all',
  /** Don't cache roles */
  None = 'none',
  /** Cache @everyone roles */
  Everyone = 'everyone',
  /** Cache roles that managed by integrations */
  Managed = 'managed',
}
