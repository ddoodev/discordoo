export default abstract class AbstractApiResponse {
  value: any

  protected constructor(data?: any) {
    if (data) this.value = data
  }

}
