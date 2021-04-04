export default interface RESTResponse<T> {
  body: T,
  statusCode: number,
  headers: Record<string, any>
}