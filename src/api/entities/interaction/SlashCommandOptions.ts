/*
import { MixinChoicesAutocomplete } from '@src/api/entities/interaction/mixins/MixinChoicesAutocomplete'
import { mix } from 'ts-mixer'
import { AppCommandOptionTypes, DiscordLocale } from '@src/constants'
import {
  AppCommandInteractionOptionPayload,
  AppCommandOptionData,
  GuildMember,
  MessageAttachment,
  RawInteractionResolvedData, Role, User
} from '@src/api'
import { MixinSlashCommandOptionBase } from '@src/api/entities/interaction/mixins/MixinSlashCommandOptionBase'
import { attach } from '@src/utils'

export class SlashCommandStringOption {
  public name!: string
  public type = AppCommandOptionTypes.STRING
  public value!: string
  public options!: AppCommandInteractionOptionPayload[]
  public focused!: boolean
  constructor(data: AppCommandInteractionOptionPayload) {
    attach(this, data, {
      props: [ 'name', 'type', 'value', 'options', 'focused' ],
    })
  }
}

export class SlashCommandMentionableOption {
  public name!: string
  public type = AppCommandOptionTypes.MENTIONABLE
  public value!: string
  public options!: AppCommandInteractionOptionPayload[]
  public focused!: boolean
  public member?: GuildMember
  public user?: User
  public role?: Role
  constructor(data: AppCommandInteractionOptionPayload, resolved: RawInteractionResolvedData) {
    attach(this, data, {
      props: [ 'name', 'type', 'value', 'options', 'focused' ],
    })
    if (!data.value) return;
    if ('roles' in resolved) {
      this.role = resolved.roles![data.value]
    }
    if ('members' in resolved) {
      this.member = resolved.members![data.value]
    }
    if ('users' in resolved) {
      this.user = resolved.users![data.value]
    }
  }
}
export class SlashCommandAttachmentOption {
  public name!: string
  public attachment!: MessageAttachment
  public constructor(data: AppCommandInteractionOptionPayload, resolved: RawInteractionResolvedData) {
    attach(this, data, {
      props: [ 'name' ],
    })
    if (!data.value) return;
    this.attachment = new MessageAttachment(resolved.attachments![data.value])
  }
}
@mix(MixinChoicesAutocomplete, MixinSlashCommandOptionBase)
export class SlashCommandStringOptionConstructor {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.STRING;
  public maxLength?: number;
  public minLength?: number;

  constructor(data: SlashCommandStringOption | AppCommandOptionData) {
    Object.assign(this, data)
  }
  public setMaxLength(maxLength: number): this {
    this.maxLength = maxLength
    return this
  }

  public setMinLength(minLength: number): this {
    this.minLength = minLength
    return this
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    }
  }
}

@mix(MixinChoicesAutocomplete, MixinSlashCommandOptionBase)
export class SlashCommandNumberOptionConstructor {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.NUMBER;
  public max?: number;
  public min?: number;

  constructor(data: SlashCommandNumberOption | AppCommandOptionData) {
    Object.assign(this, data)
  }

  public setMax(max: number): this {
    this.max = max
    return this
  }

  public setMin(min: number): this {
    this.min = min
    return this
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    }
  }
}

@mix(MixinChoicesAutocomplete, MixinSlashCommandOptionBase)
export class SlashCommandIntegerOptionConstructor {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.INTEGER;
  public max?: number;
  public min?: number;
  constructor(data: SlashCommandIntegerOption | AppCommandOptionData) {
    Object.assign(this, data)
  }

  public setMax(max: number): this {
    this.max = max
    return this
  }

  public setMin(min: number): this {
    this.min = min
    return this
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    }
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandBooleanOptionConstructor {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.BOOLEAN;
  constructor(data: SlashCommandBooleanOption | AppCommandOptionData) {
    Object.assign(this, data)
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    }
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandUserOptionConstructor {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.USER;
  constructor(data: SlashCommandUserOption | AppCommandOptionData) {
    Object.assign(this, data)
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    }
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandChannelOptionConstructor {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.CHANNEL;
  constructor(data: SlashCommandChannelOption | AppCommandOptionData) {
    Object.assign(this, data)
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    }
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandRoleOptionConstructor {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.ROLE;
  constructor(data: SlashCommandRoleOption | AppCommandOptionData) {
    Object.assign(this, data)
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    }
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandMentionableOptionConstructor {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.MENTIONABLE;
  constructor(data: SlashCommandMentionableOption | AppCommandOptionData) {
    Object.assign(this, data)
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    }
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandAttachmentOptionConstructor {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.ATTACHMENT;
  constructor(data: SlashCommandAttachmentOption | AppCommandOptionData) {
    Object.assign(this, data)
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    }
  }
}*/
