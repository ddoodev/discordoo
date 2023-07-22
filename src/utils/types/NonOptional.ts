/** Make specified interface field non-optional */
export type NonOptional<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
