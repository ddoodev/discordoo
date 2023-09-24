import { ChannelTypes, ComponentTypes } from '@src/constants'
import { SelectMenuDefaultValueData, SelectMenuOptionData } from '@src/api'

export type SelectMenuComponentData = SelectUserMenuComponentData
  | SelectRoleMenuComponentData
  | SelectMentionableMenuComponentData
  | SelectStringMenuComponentData
  | SelectChannelMenuComponentData

export interface AbstractSelectMenuComponentData {
  customId: string
  placeholder?: string
  minValues?: number
  maxValues?: number
  disabled?: boolean
}

export interface SelectUserMenuComponentData extends AbstractSelectMenuComponentData {
  type: ComponentTypes.UserSelect
  defaultValues?: SelectMenuDefaultValueData[]
}

export interface SelectRoleMenuComponentData extends AbstractSelectMenuComponentData {
  type: ComponentTypes.RoleSelect
  defaultValues?: SelectMenuDefaultValueData[]
}

export interface SelectMentionableMenuComponentData extends AbstractSelectMenuComponentData {
  type: ComponentTypes.MentionableSelect
  defaultValues?: SelectMenuDefaultValueData[]
}

export interface SelectStringMenuComponentData extends AbstractSelectMenuComponentData {
  type: ComponentTypes.StringSelect
  options: SelectMenuOptionData[]
}

export interface SelectChannelMenuComponentData extends AbstractSelectMenuComponentData {
  type: ComponentTypes.ChannelSelect
  channelTypes?: ChannelTypes[]
  defaultValues?: SelectMenuDefaultValueData[]
}
