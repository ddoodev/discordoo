import { AbstractEvent } from '@src/events'
import { AppCommandOptionTypes, EventNames } from '@src/constants'
import {
  AppCommandInteractionOptionPayload,
  RawAppCommandInteractionData,
  RawInteractionData, RawInteractionResolvedData,
  RawUiAppCommandInteractionData
} from '@src/api'
// import {
//   SlashCommandSubcommandConstructor,
//   SlashCommandSubcommandGroupConstructor
// } from '@src/api/entities/interaction/SlashCommandConstructor'
// import {
//   SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandIntegerOption,
//   SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption,
//   SlashCommandStringOption, SlashCommandUserOption
// } from '@src/api/entities/interaction/SlashCommandOptions'
// import { Collection } from '@discordoo/collection'

export class InteractionCreateEvent extends AbstractEvent<any> {
  public name = EventNames.INTERACTION_CREATE

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async execute(shardId: number, interaction: RawInteractionData<RawAppCommandInteractionData | RawUiAppCommandInteractionData>) {
    const rawOptions: AppCommandInteractionOptionPayload[] = interaction.data.options ?? []
    console.log(rawOptions)
    const resolved: RawInteractionResolvedData = interaction.data?.resolved ?? {}
    console.log(resolved)
    // const options: Collection<string,
    //   SlashCommandStringOption  | SlashCommandBooleanOption |
    //   SlashCommandAttachmentOption | SlashCommandChannelOption |
    //   SlashCommandIntegerOption | SlashCommandMentionableOption |
    //   SlashCommandNumberOption | SlashCommandRoleOption | SlashCommandUserOption
    // > = new Collection()
    //
    // for (const option of rawOptions) {
    //   switch (option.type) {
    //     case AppCommandOptionTypes.SUB_COMMAND:
    //       options.set(option.name, new SlashCommandSubcommandConstructor(option))
    //       break
    //     case AppCommandOptionTypes.SUB_COMMAND_GROUP: /* @ts-ignore */
    //       options.push(new SlashCommandSubcommandGroupConstructor(option))
    //       break
    //     case AppCommandOptionTypes.STRING: /* @ts-ignore */
    //       options.push(new SlashCommandStringOption(option))
    //       break
    //     case AppCommandOptionTypes.ATTACHMENT:
    //       if (!option.value) break /* @ts-ignore */
    //       options.push(new SlashCommandAttachmentOption({ ...option, value: resolved.attachments?.[option.value] }))
    //   }
    // }
    // console.log(options)
    const context = {}
  }
}