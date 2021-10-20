// based on https://github.com/discordjs/discord.js/blob/7513b4528ca1b6cf03b8af147feb73ea42a4f8e6/src/util/Util.js#L483 (Apache License 2.0)
export function discordSort(array: Record<string, any>[]): Record<string, any>[] {
  return array.sort((a, b) => {
    return a.rawPosition - b.rawPosition
      || parseInt(b.id.slice(0, -10)) - parseInt(a.id.slice(0, -10))
      || parseInt(b.id.slice(10)) - parseInt(a.id.slice(10))
  })
}
