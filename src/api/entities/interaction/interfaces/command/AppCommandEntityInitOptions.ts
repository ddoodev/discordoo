import { EntityInitOptions } from '@src/api/entities/EntityInitOptions'

export interface AppCommandEntityInitOptions extends EntityInitOptions {
  /**
   * This will be passed to the {@link AppCommandOption} constructor when initializing the options
   * */
  optionsInit?: EntityInitOptions
}