export function mergeNewOrSave(obj1: any, obj2: any, props: string[]): void {
  props.forEach(p => p in obj2 ? obj1[p] = obj2[p] : undefined)
}
