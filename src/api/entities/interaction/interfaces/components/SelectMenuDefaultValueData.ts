import { SelectMenuDefaultValueType } from '@src/constants'
import { ChannelResolvable, RoleResolvable, UserResolvable } from '@src/api'

export type SelectMenuDefaultValueDataIdResolvable = ChannelResolvable | RoleResolvable | UserResolvable

export interface SelectMenuDefaultValueData {
  id: SelectMenuDefaultValueDataIdResolvable
  type: SelectMenuDefaultValueType
}
