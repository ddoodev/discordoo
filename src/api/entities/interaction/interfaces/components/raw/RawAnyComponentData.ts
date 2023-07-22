import { RawActionRowData, RawButtonComponentData, RawSelectMenuComponentData, RawTextInputComponentData } from '../../../../../../../src/api'

export type RawAnyComponentData = RawActionRowData | RawButtonComponentData | RawSelectMenuComponentData | RawTextInputComponentData
export type RawActionRowContainsData = Exclude<RawAnyComponentData, RawActionRowData>
