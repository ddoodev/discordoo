export function clone(target: Record<any, any>) {
  return Object.assign(Object.create(target), target)
}
