import { AppCommand, AppCommandData, RawAppCommandData, Resolvable } from '../../../../../../src/api'

export type CommandResolvable = Resolvable<AppCommand | AppCommandData | RawAppCommandData>
