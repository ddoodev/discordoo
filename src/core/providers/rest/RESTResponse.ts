/**
 * Data fetched from REST
 * @template T - body type
 */
export default interface RESTResponse<T = Record<string, any>> {
  /** Body */
  body: T
  /** Status code */
  statusCode: number
  /** Headers */
  headers: Record<string, any>
}
