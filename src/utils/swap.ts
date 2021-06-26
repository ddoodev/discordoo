export function swap(arr: any[], pos1: number, pos2: number) {
  // dont using [ arr[pos1], arr[pos2] ] = [ arr[pos2], arr[pos1] ] because it has low performance
  const temp = arr[pos1]

  arr[pos1] = arr[pos2]
  arr[pos2] = temp

  return arr
}
