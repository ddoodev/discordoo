import RequestOptions from './RequestOptions'
import RESTResponse from './RESTResponse'

export default interface RequestBuilder {
  url(...paths: string[]): RequestBuilder
  query(k: string, v: string): RequestBuilder
  get<T>(options: RequestOptions): Promise<RESTResponse<T>>
  post<T>(options: RequestOptions): Promise<RESTResponse<T>>
  delete<T>(options: RequestOptions): Promise<RESTResponse<T>>
  put<T>(options: RequestOptions): Promise<RESTResponse<T>>
  patch<T>(options: RequestOptions): Promise<RESTResponse<T>>
}