/** Permissions Overwrites caching policy */
export enum OverwritesCachingPolicy {
  /** Cache all overwrites */
  ALL = 'all',
  /** Don't cache overwrites */
  NONE = 'none',
  /** Cache overwrites with type 'member' */
  MEMBERS = 'members',
  /** Cache overwrites with type 'role' */
  ROLES = 'roles',
}
