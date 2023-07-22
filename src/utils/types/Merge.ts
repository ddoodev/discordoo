export type Merge<T, X> = Omit<T, keyof X> & X
