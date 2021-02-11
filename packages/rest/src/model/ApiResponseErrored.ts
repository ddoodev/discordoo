import AbstractApiResponse from './AbstractApiResponse'
import { AxiosError } from 'axios'

export default class ApiResponseErrored extends AbstractApiResponse {
  public message: string
  public name: string

  constructor(response: AxiosError) {
    super(response)

    this.code = response.code
    this.message = response.message
    this.name = response.name
  }

}
