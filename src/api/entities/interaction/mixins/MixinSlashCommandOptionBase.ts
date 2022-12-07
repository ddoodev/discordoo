import { RawMixinNameDescriptionData } from "@src/api/entities/interaction/mixins/interfaces/RawMixinNameDescriptionData";
import { DiscordLocale } from "@src/constants";

export class MixinSlashCommandOptionBase {
  public name!: string;
  public nameLocalizations?: Record<DiscordLocale, string>;
  public description!: string;
  public descriptionLocalizations?: Record<DiscordLocale, string>;
  public required?: boolean;

  public setName(name: string): this {
    this.name = name;
    return this;
  }

  public setNameLocalization(data: Record<DiscordLocale, string>): this {
    this.nameLocalizations = data;
    return this;
  }

  public setDescription(description: string): this {
    this.description = description;
    return this;
  }

  public addDescriptionLocalization(data: Record<DiscordLocale, string>): this {
    this.descriptionLocalizations = data;
    return this;
  }

  public setRequired(required: boolean): this {
    this.required = required;
    return this;
  }
}
