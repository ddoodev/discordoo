import { RestResponse } from '@src/core/providers/rest/responses/RestResponse'

export interface RestResponseSuccess<Body = any> extends RestResponse {
  success: true
  result: Body
}
