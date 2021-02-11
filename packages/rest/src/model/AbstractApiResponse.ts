export default class AbstractApiResponse {
  value: any
  code: string | undefined

  constructor(data?: any) {
    if (data) this.value = data
  }

}
