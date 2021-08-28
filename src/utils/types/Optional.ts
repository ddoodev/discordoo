/** Make specified interface field optional */
export type Optional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] }
