import { AllowedImageFormats, AllowedImageSizes } from '@src/utils'

export interface ImageUrlOptions {
  format?: AllowedImageFormats
  size?: AllowedImageSizes
  dynamic?: boolean
}
