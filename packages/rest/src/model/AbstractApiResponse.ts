export default class AbstractApiResponse {
  value: any

  constructor(data?: any) {
    if (data) this.value = data
  }

}
