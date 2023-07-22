export function moveElementInArray(array: any[], fromIndex, toIndex, offset = false): any[] {
  toIndex = (offset ? fromIndex : 0) + toIndex

  if (toIndex > -1 && toIndex < array.length) {
    const removedElement = array.splice(fromIndex, 1)[0]
    array.splice(toIndex, 0, removedElement)
  }

  return array
}
