import { RestResponse } from '@src/core/providers/rest/responces/RestResponse'
import { RestError } from '@src/core/providers/rest/RestError'

export interface RestResponseError extends RestResponse {
  success: false
  error: RestError
}
