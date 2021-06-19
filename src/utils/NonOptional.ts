/** Makes specified interface field non optional */
type NonOptional<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export default NonOptional
