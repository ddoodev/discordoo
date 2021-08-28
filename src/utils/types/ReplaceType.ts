/** Replace specified interface field to another type */
export type ReplaceType<T, K extends keyof T, X> = Omit<T, K> & { [P in K]: X }
