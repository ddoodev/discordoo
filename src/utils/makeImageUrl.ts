import { is } from 'typescript-is'
import { ValidationError } from '@src/utils/ValidationError'
import { AllowedImageFormats, AllowedImageSizes, ImageUrlOptions } from '@src/utils'

export function makeImageUrl(url: string, defaultFormat: AllowedImageFormats, options: ImageUrlOptions): string {
  if (!is<AllowedImageFormats | undefined>(options.format)) {
    throw new ValidationError(undefined, 'Incorrect image format:', options.format)
  }

  if (!is<AllowedImageSizes | undefined>(options.size)) {
    throw new ValidationError(undefined, 'Incorrect image size:', options.size)
  }

  return `${url}.${options.format ?? defaultFormat}${options.size ? `?size=${options.size}` : ''}`
}
