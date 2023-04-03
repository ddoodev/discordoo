import {
  AppCommandBooleanOptionData,
  AppCommandChannelOptionData,
  AppCommandIntegerOptionData, AppCommandMentionableOptionData,
  AppCommandNumberOptionData,
  AppCommandOptionData, AppCommandRoleOptionData,
  AppCommandStringOptionData, AppCommandUserOptionData
} from '@src/api'

export class MixinSlashCommandOptions {
  public options: AppCommandOptionData[] = []
  public addStringOption(option: AppCommandStringOptionData): this {
    this.options.push(option)
    return this
  }
  public addNumberOption(option: AppCommandNumberOptionData): this {
    this.options.push(option)
    return this
  }
  public addIntegerOption(option: AppCommandIntegerOptionData): this {
    this.options.push(option)
    return this
  }
  public addChannelOption(option: AppCommandChannelOptionData): this {
    this.options.push(option)
    return this
  }
  public addRoleOption(option: AppCommandRoleOptionData): this {
    this.options.push(option)
    return this
  }
  public addUserOption(option: AppCommandUserOptionData): this {
    this.options.push(option)
    return this
  }
  public addMentionableOption(option: AppCommandMentionableOptionData): this {
    this.options.push(option)
    return this
  }
  public addBooleanOption(option: AppCommandBooleanOptionData): this {
    this.options.push(option)
    return this
  }
}
