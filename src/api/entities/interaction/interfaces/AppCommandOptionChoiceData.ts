export interface AppCommandOptionChoiceData {
  /** 1-100 character choice name */
  name: string
  /** value of the choice, up to 100 characters if string. depends on the option type that the choice belongs to. */
  value: string | number
}