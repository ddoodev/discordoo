export default function idToDate(id: string): Date {
  return new Date(+id / 4194304 + 1420070400000)
}
