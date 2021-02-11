import AbstractApiResponse from './AbstractApiResponse'
import { AxiosResponse } from 'axios'

export default class ApiResponseSuccess extends AbstractApiResponse {

  constructor(response: AxiosResponse) {
    super(response.data)
  }

}
