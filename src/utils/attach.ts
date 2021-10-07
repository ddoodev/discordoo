export function attach(obj1: any, obj2: any, props: string[]): void {
  props.forEach(p => obj1[p] = obj2[p])
}
