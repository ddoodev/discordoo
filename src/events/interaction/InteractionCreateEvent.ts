import { AbstractEvent, InteractionCreateEventContext } from '@src/events'
import { EventNames, InteractionTypes } from '@src/constants'
import {
  EntitiesUtil,
  RawAppCommandInteractionData,
  RawInteractionData, RawModalSubmitData,
  RawUiAppCommandInteractionData
} from '@src/api'
import { channelEntityKey } from '@src/utils'

export class InteractionCreateEvent extends AbstractEvent<InteractionCreateEventContext> {
  public name = EventNames.INTERACTION_CREATE

  async execute(
    shardId: number,
    data: RawInteractionData<RawAppCommandInteractionData | RawUiAppCommandInteractionData | RawModalSubmitData>
    ): Promise<InteractionCreateEventContext> {

    let Interaction
    switch (data.type) {
      case InteractionTypes.ApplicationCommand:
        // console.log(inspect(data, false, 9))
        Interaction = EntitiesUtil.get('AppCommandInteraction')
        break
      case InteractionTypes.ApplicationCommandAutocomplete:
        Interaction = EntitiesUtil.get('AutocompleteInteraction')
        break
      case InteractionTypes.MessageComponent:
        Interaction = EntitiesUtil.get('MessageComponentInteraction')
        break
      case InteractionTypes.ModalSubmit:
        Interaction = EntitiesUtil.get('ModalSubmitInteraction')
        break
      case InteractionTypes.Ping:
        break
    }

    if (data.channel) {
      let channel = await this.app.channels.cache.get(data.channel.id, { storage: data.guild_id ?? 'dm' })

      try {
        if (channel) {
          channel = await channel.init(data.channel as any)
        } else {
          const Channel: any = EntitiesUtil.get(channelEntityKey(data.channel))
          channel = await new Channel(this.app).init({ ...data.channel, guildId: data.guild_id })
        }
      } catch (e) {
        // try...catch block is here because channel is marked as partial in discord docs
        // but actually discord sends full channel object
        // if discord sends a partial object (according to docs), init function will throw an error
      }

      if (channel && channel.constructor.name !== 'AbstractChannel') {
        await this.app.channels.cache.set(channel.id, channel, { storage: 'guildId' in channel ? channel.guildId : 'dm' })
      }
    }

    if (data.message) {
      let message = await this.app.messages.cache.get(data.message.id, { storage: data.message.channel_id })

      if (message) {
        message = await message.init(data.message)
      } else {
        const Message = EntitiesUtil.get('Message')
        message = await new Message(this.app).init(data.message)
      }

      await this.app.messages.cache.set(message.id, message, { storage: message.channelId })
    }

    if (data.member) {
      let member = await this.app.members.cache.get(data.member.user.id, { storage: data.guild_id })

      if (member) {
        member = await member.init(data.member)
      } else {
        const GuildMember = EntitiesUtil.get('GuildMember')
        member = await new GuildMember(this.app).init({ ...data.member, guildId: data.guild_id })
      }

      await this.app.members.cache.set(member.userId, member, { storage: member.guildId })

      if (data.member.user) {
        let user = await this.app.users.cache.get(data.member.user.id)

        if (user) {
          user = await user.init(data.member.user)
        } else {
          const User = EntitiesUtil.get('User')
          user = await new User(this.app).init(data.member.user)
        }

        await this.app.users.cache.set(user.id, user)
      }
    }

    if (data.user) {
      let user = await this.app.users.cache.get(data.user.id)

      if (user) {
        user = await user.init(data.user)
      } else {
        const User = EntitiesUtil.get('User')
        user = await new User(this.app).init(data.user)
      }

      await this.app.users.cache.set(user.id, user)
    }

    const context: InteractionCreateEventContext = {
      shardId,
      interaction: await new Interaction(this.app).init(data)
    }

    this.app.emit(EventNames.INTERACTION_CREATE, context)
    return context
  }
}
