/** Permissions Overwrites caching policy */
export enum OverwritesCachingPolicy {
  /** Cache all overwrites */
  All = 'all',
  /** Don't cache overwrites */
  None = 'none',
  /** Cache overwrites with type 'member' */
  Members = 'members',
  /** Cache overwrites with type 'role' */
  Roles = 'roles',
}
