import { DiscordRestApplication } from '../../../../src/core'
import { createMessagePayload, DiscordooError, resolveMessageId } from '../../../../src/utils'
import { EntitiesManager } from '../../../../src/api/managers/EntitiesManager'
import { InteractionResponseTypes, MessageFlags } from '../../../../src/constants'
import {
  AppCommandOptionChoiceData,
  ApplicationInteractionsApplicationCommandManager,
  EntitiesUtil, InteractionMessageEditOptions,
  MessageResolvable,
  ModalBuilder,
  ModalData,
  RawAppCommandOptionChoiceData,
  RawModalData
} from '../../../../src/api'
import { InteractionMessageContent } from '../../../../src/api/entities/message/interfaces/MessageContent'
import { InteractionMessageCreateOptions } from '../../../../src/api/entities/message/interfaces/MessageCreateOptions'

export class ApplicationInteractionsManager extends EntitiesManager {
  public commands: ApplicationInteractionsApplicationCommandManager

  constructor(app: DiscordRestApplication) {
    super(app)
    this.commands = new ApplicationInteractionsApplicationCommandManager(app)
  }

  async deferComponentReply(interactionId: string, token: string) {
    const response = await this.app.internals.actions.createInteractionResponse(interactionId, token, {
      type: InteractionResponseTypes.DeferredUpdateMessage,
    })

    return response.success
  }

  async deferReply(interactionId: string, token: string, ephemeral?: boolean): Promise<boolean> {
    const response = await this.app.internals.actions.createInteractionResponse(interactionId, token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      data: {
        flags: ephemeral ? MessageFlags.Ephemeral : undefined
      }
    })

    return response.success
  }

  async deleteReply(token: string, message: MessageResolvable = '@original') {
    const messageId = resolveMessageId(message)
    if (!messageId) {
      throw new DiscordooError('ApplicationInteractionsManager#deleteReply', 'Cannot delete message without message id')
    }

    const response = await this.app.internals.actions.deleteInteractionResponse(this.app.user.id, token, messageId)
    return response.success
  }

  async editComponentReply(
    interactionId: string,
    token: string,
    content: InteractionMessageContent,
    options?: InteractionMessageCreateOptions
  ) {
    const payload = await createMessagePayload<true>(content, options)

    const response = await this.app.internals.actions.createInteractionResponse(interactionId, token, {
      type: InteractionResponseTypes.UpdateMessage,
      data: payload
    })

    return response.success
  }

  async editFollowUp(
    id: string,
    token: string,
    messageResolvable: MessageResolvable,
    content: InteractionMessageContent,
  ) {
    const messageId = resolveMessageId(messageResolvable)
    if (!messageId) {
      throw new DiscordooError('ApplicationInteractionsManager#editFollowUp', 'Cannot edit follow up message without message id')
    }

    const payload = await createMessagePayload(content)

    const response = await this.app.internals.actions.editFollowUpMessage(id, token, messageId, payload)
    if (response.success) {
      const Message = EntitiesUtil.get('Message')
      const message = await new Message(this.app).init(response.result)

      await this.app.messages.cache.set(message.id, message, { storage: message.channelId })

      return message
    }
  }

  async editReply(
    token: string,
    content: InteractionMessageContent,
    options?: InteractionMessageEditOptions
  ) {
    const messageId = resolveMessageId(options?.message ?? '@original')
    if (!messageId) {
      throw new DiscordooError('ApplicationInteractionsManager#editReply', 'Cannot edit message without message id')
    }

    const payload = await createMessagePayload<true>(content, options) as InteractionMessageEditOptions

    const response = await this.app.internals.actions.editOriginalInteractionResponse(this.app.user.id, token, payload, messageId)
    if (response.success) {
      const Message = EntitiesUtil.get('Message')
      const message = await new Message(this.app).init(response.result)

      await this.app.messages.cache.set(message.id, message, { storage: message.channelId })

      return message
    }
  }

  async fetchFollowUp(id: string, token: string, messageResolvable: MessageResolvable) {
    const messageId = resolveMessageId(messageResolvable)
    if (!messageId) {
      throw new DiscordooError('ApplicationInteractionsManager#fetchFollowUp', 'Cannot fetch follow up message without message id')
    }

    const response = await this.app.internals.actions.getFollowUpMessage(id, token, messageId)
    if (response.success) {
      const Message = EntitiesUtil.get('Message')
      const message = await new Message(this.app).init(response.result)

      await this.app.messages.cache.set(message.id, message, { storage: message.channelId })


      return message
    }
  }

  async fetchReply(id: string, token: string) {
    const response = await this.app.internals.actions.getOriginalInteractionResponse(id, token, '@original')

    if (response.success) {
      const Message = EntitiesUtil.get('Message')
      const message = await new Message(this.app).init(response.result)

      await this.app.messages.cache.set(message.id, message, { storage: message.channelId })

      return message
    }
  }

  async reply(
    id: string, token: string, content: InteractionMessageContent, options?: InteractionMessageCreateOptions
  ): Promise<boolean> {
    const message = await createMessagePayload<true>(content, options)

    const response = await this.app.internals.actions.createInteractionResponse(id, token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: message,
    })

    return response.success
  }

  async replyFollowUp(
    applicationId: string,
    token: string,
    content: InteractionMessageContent,
    options?: InteractionMessageCreateOptions
  ) {
    const message = await createMessagePayload<true>(content, options)
    const response = await this.app.internals.actions.createFollowUpMessage(applicationId, token, message)

    if (response.success) {
      const Message = EntitiesUtil.get('Message')
      const message = await new Message(this.app).init(response.result)

      await this.app.messages.cache.set(message.id, message, { storage: message.channelId })

      return message
    }
  }

  async sendChoices(
    id: string,
    token: string,
    choices: Array<RawAppCommandOptionChoiceData | AppCommandOptionChoiceData>
  ): Promise<boolean> {
    const rawChoicesData: RawAppCommandOptionChoiceData[] = choices.map((choice) => {
      if ('nameLocalizations' in choice) {
        return {
          name: choice.name,
          name_localizations: choice.nameLocalizations,
          value: choice.value
        }
      }

      return choice
    })

    const response = await this.app.internals.actions.createInteractionResponse(id, token, {
      type: InteractionResponseTypes.ApplicationCommandAutocompleteResult,
      data: {
        choices: rawChoicesData
      }
    })

    return response.success
  }

  async sendModal(id: string, token: string, modal: ModalBuilder | ModalData | RawModalData) {
    let rawModalData: RawModalData

    if (modal instanceof ModalBuilder) {
      rawModalData = modal.toJSON()
    } else if ('customId' in modal) {
      const modalBuilder = new ModalBuilder(modal)
      rawModalData = modalBuilder.toJSON()
    } else {
      rawModalData = modal
    }

    const response = await this.app.internals.actions.createInteractionResponse(id, token, {
      type: InteractionResponseTypes.Modal,
      data: rawModalData
    })

    return response.success
  }
}
