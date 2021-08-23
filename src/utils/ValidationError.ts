import { DiscordooError } from '@src/utils/DiscordooError'

export class ValidationError extends DiscordooError {
  public name = 'ValidationError'
  public options?: any

  _setInvalidOptions(options: any): this {
    this.options = options
    return this
  }
}
