import { WebSocketUtils } from '@src/utils/WebSocketUtils'

/**
 * Inserts properties from one object into another.
 * @param to - the object to which the properties are assigned
 * @param from - the object from which the properties are taken
 * @param props - array of properties to be processed.
 * if the element is an array, then the first two elements should be called object property names (like camelProperty & snake_property),
 * and the third one is the default value.
 * @example ```js
 * attach(this, data, [ 'property', [ 'someProperty', 'some_property', false ], [ 'anotherProp', '', false ] ])
 * ```
 * */
export function attach(to: any, from: any, props: Array<string | [ string, string, any? ]>): void {
  props.forEach(property => {
    if (typeof property === 'string' && WebSocketUtils.exists(from[property])) {
      to[property] = from[property]
    } else if (Array.isArray(property)) {

      if (from[property[0]] !== undefined) {
        if (from[property[0]] === null) {
          delete to[property[0]]
        } else {
          to[property[0]] = from[property[0]]
        }
      } else if (from[property[1]] !== undefined) {
        if (from[property[1]] === null) {
          delete to[property[0]]
        } else {
          to[property[0]] = from[property[1]]
        }
      } else if (property[2] !== undefined && to[property[0]] === undefined) {
        to[property[0]] = property[2]
      }
    }
  })
}
