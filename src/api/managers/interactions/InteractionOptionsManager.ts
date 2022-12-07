// import { AppCommandOptionData, EntitiesManager } from '@src/api'
// import { Client } from '@src/core'
// import {
//   SlashCommandAttachmentOption,
//   SlashCommandBooleanOption,
//   SlashCommandChannelOption,
//   SlashCommandIntegerOption,
//   SlashCommandMentionableOption,
//   SlashCommandNumberOption,
//   SlashCommandRoleOption,
//   SlashCommandStringOption,
//   SlashCommandUserOption
// } from '@src/api/entities/interaction/SlashCommandOptions'
// import { AppCommandOptionTypes } from '@src/constants'
//
// export class InteractionOptionsManager extends EntitiesManager {
//   public options: Map<string,
//     SlashCommandStringOption  | SlashCommandBooleanOption |
//     SlashCommandAttachmentOption | SlashCommandChannelOption |
//     SlashCommandIntegerOption | SlashCommandMentionableOption |
//     SlashCommandNumberOption | SlashCommandRoleOption | SlashCommandUserOption
//   >
//   constructor(client: Client, options: AppCommandOptionData[]) {
//     super(client)
//     this.options = new Map()
//     for (const option of options)
//       this.options.set(option.name, this.resolveOption(option))
//
//   }
//
//   private resolveOption(option: AppCommandOptionData) {
//
//   }
// }