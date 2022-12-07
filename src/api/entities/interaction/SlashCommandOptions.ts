import { MixinChoicesAutocomplete } from "@src/api/entities/interaction/mixins/MixinChoicesAutocomplete";
import { mix } from "ts-mixer";
import { AppCommandOptionTypes, DiscordLocale } from "@src/constants";
import { AppCommandOptionData } from "@src/api";
import { MixinSlashCommandOptionBase } from "@src/api/entities/interaction/mixins/MixinSlashCommandOptionBase";

@mix(MixinChoicesAutocomplete, MixinSlashCommandOptionBase)
export class SlashCommandStringOption {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.STRING;
  public maxLength?: number;
  public minLength?: number;

  public setMaxLength(maxLength: number): this {
    this.maxLength = maxLength;
    return this;
  }

  public setMinLength(minLength: number): this {
    this.minLength = minLength;
    return this;
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    };
  }
}

@mix(MixinChoicesAutocomplete, MixinSlashCommandOptionBase)
export class SlashCommandNumberOption {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.NUMBER;
  public max?: number;
  public min?: number;

  public setMax(max: number): this {
    this.max = max;
    return this;
  }

  public setMin(min: number): this {
    this.min = min;
    return this;
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    };
  }
}

@mix(MixinChoicesAutocomplete, MixinSlashCommandOptionBase)
export class SlashCommandIntegerOption {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.INTEGER;
  public max?: number;
  public min?: number;

  public setMax(max: number): this {
    this.max = max;
    return this;
  }

  public setMin(min: number): this {
    this.min = min;
    return this;
  }

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    };
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandBooleanOption {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.BOOLEAN;

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    };
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandUserOption {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.USER;

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    };
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandChannelOption {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.CHANNEL;

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    };
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandRoleOption {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.ROLE;

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    };
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandMentionableOption {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.MENTIONABLE;

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    };
  }
}

@mix(MixinSlashCommandOptionBase)
export class SlashCommandAttachmentOption {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;
  public type: AppCommandOptionTypes = AppCommandOptionTypes.ATTACHMENT;

  public toJSON(): AppCommandOptionData {
    return {
      ...this,
    };
  }
}
