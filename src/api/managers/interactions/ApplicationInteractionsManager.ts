import { DiscordRestApplication } from '@src/core'
import { createMessagePayload } from '@src/utils'
import { EntitiesManager } from '@src/api/managers/EntitiesManager'
import { InteractionResponseTypes } from '@src/constants'
import { ApplicationInteractionsSlashCommandManager } from '@src/api'
import { InteractionMessageContent } from '@src/api/entities/message/interfaces/MessageContent'
import { InteractionMessageCreateOptions } from '@src/api/entities/message/interfaces/MessageCreateOptions'

export class ApplicationInteractionsManager extends EntitiesManager {
  public commands: ApplicationInteractionsSlashCommandManager

  constructor(app: DiscordRestApplication) {
    super(app)
    this.commands = new ApplicationInteractionsSlashCommandManager(app)
  }

  async reply(
    id: string, token: string, content: InteractionMessageContent, options?: InteractionMessageCreateOptions
  ): Promise<boolean> {
    const message = await createMessagePayload<true>(content, options)

    const response = await this.app.internals.actions.createInteractionResponse(id, token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: message,
    })

    // console.log(response.result.errors.type._errors)
    // какое-то дерьмо code: 'BASE_TYPE_CHOICES', message: 'Value must be one of {9, 10, 4, 5}.'

    return response.success
  }

  async defer(id: string, token: string): Promise<boolean> {
    const response = await this.app.internals.actions.createInteractionResponse(id, token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    })

    return response.success
  }
}
