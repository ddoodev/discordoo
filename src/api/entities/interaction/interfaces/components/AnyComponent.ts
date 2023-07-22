import {
  ActionRowBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
  TextInputBuilder
} from '../../../../../../src/api'

export type AnyComponent = ActionRowBuilder | ButtonBuilder | SelectMenuBuilder | TextInputBuilder
export type ActionRowContains = Exclude<AnyComponent, ActionRowBuilder>
