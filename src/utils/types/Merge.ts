/** Merge two interfaces and redefine the properties of the first one */
export type Merge<T, X> = Omit<T, keyof X> & X
