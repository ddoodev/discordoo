/** Makes specified interface field optional */
type Optional<T, K extends keyof T> = Omit<T, K> & { [P in K]?: T[P] | undefined }

export default Optional
