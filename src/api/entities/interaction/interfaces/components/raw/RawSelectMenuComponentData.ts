import { ChannelTypes, ComponentTypes } from '@src/constants'
import { RawSelectMenuDefaultValueData, SelectMenuOptionData } from '@src/api'

export type RawSelectMenuComponentData = RawSelectUserMenuComponentData
  | RawSelectRoleMenuComponentData
  | RawSelectMentionableMenuComponentData
  | RawSelectStringMenuComponentData
  | RawSelectChannelMenuComponentData

export interface RawAbstractSelectMenuComponentData {
  custom_id: string
  placeholder?: string
  min_values?: number
  max_values?: number
  disabled?: boolean
}

export interface RawSelectUserMenuComponentData extends RawAbstractSelectMenuComponentData {
  type: ComponentTypes.UserSelect
  default_values?: RawSelectMenuDefaultValueData[]
}

export interface RawSelectRoleMenuComponentData extends RawAbstractSelectMenuComponentData {
  type: ComponentTypes.RoleSelect
  default_values?: RawSelectMenuDefaultValueData[]
}

export interface RawSelectMentionableMenuComponentData extends RawAbstractSelectMenuComponentData {
  type: ComponentTypes.MentionableSelect
  default_values?: RawSelectMenuDefaultValueData[]
}

export interface RawSelectStringMenuComponentData extends RawAbstractSelectMenuComponentData {
  type: ComponentTypes.StringSelect
  options: SelectMenuOptionData[]
}

export interface RawSelectChannelMenuComponentData extends RawAbstractSelectMenuComponentData {
  type: ComponentTypes.ChannelSelect
  channel_types?: ChannelTypes[]
  default_values?: RawSelectMenuDefaultValueData[]
}
