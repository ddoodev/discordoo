/**
 * Data fetched from REST
 * @template T - body type
 */
export interface RESTResponse<T = Record<string, any>> {
  /** Body */
  body: T
  /** Status code */
  statusCode: number
  /** Headers */
  headers: Record<string, any>
}
