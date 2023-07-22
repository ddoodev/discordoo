import { ActionRowData, ButtonComponentData, SelectMenuComponentData, TextInputComponentData } from '../../../../../../src/api'

export type AnyComponentData = ActionRowData | ButtonComponentData | SelectMenuComponentData | TextInputComponentData
export type ActionRowContainsData = Exclude<AnyComponentData, ActionRowData>
