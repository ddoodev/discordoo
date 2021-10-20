// based on https://github.com/discordjs/discord.js/blob/7513b4528ca1b6cf03b8af147feb73ea42a4f8e6/src/util/Util.js#L389 (Apache License 2.0)
export function moveElementInArray(array: any[], fromIndex, toIndex, offset = false): any[] {
  toIndex = (offset ? fromIndex : 0) + toIndex

  if (toIndex > -1 && toIndex < array.length) {
    const removedElement = array.splice(fromIndex, 1)[0]
    array.splice(toIndex, 0, removedElement)
  }

  return array
}
