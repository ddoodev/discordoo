import { DiscordLocale } from "@src/constants";

export interface MixinNameDescriptionData {
  name: string;
  nameLocalizations?: Record<DiscordLocale, string>;
  description: string;
  descriptionLocalizations?: Record<DiscordLocale, string>;
}
