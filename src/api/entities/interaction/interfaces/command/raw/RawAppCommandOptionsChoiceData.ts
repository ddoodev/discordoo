import { Locale } from '@src/constants/common/Locale'

export interface RawAppCommandOptionsChoiceData {
  /** 1-100 character choice name */
  name: string
  /** localization dictionary for the `name` field. values follow the same restrictions as `name` */
  name_localizations?: Record<Locale, string>
  /** value of the choice, up to 100 characters if string. depends on the option type that the choice belongs to. */
  value: string | number
}