export async function asyncSome<T>(
  values: T[], predicate: (value: T, index: number, array: T[]) => Promise<boolean> | boolean
): Promise<boolean> {
  let i = 0

  for await (const value of values) {
    if (await predicate(value, i++, values)) {
      return true
    }
  }

  return false
}
