/** Represents predicate fn for collection filters/maps/find and other */
export type Predicate<K, V, Collection, R = unknown> = (value: V, key: K, collection: Collection) => R
