import { RestResponseSuccess } from '@src/core/providers/rest/responses/RestResponseSuccess'
import { RestResponseError } from '@src/core/providers/rest/responses/RestResponseError'

/**
 * Just internal type alias because we don't like use ctrl+c and ctrl+v
 * @internal
 * */
export type RestRequestResponse<T> = Promise<RestResponseSuccess<T> | RestResponseError>
