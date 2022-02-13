import { IgnoreAllSymbol } from '@src/constants'

/** Options for attach function */
export interface AttachOptions {
  /**
   * if the element is an array, then the first two elements should be called object property names (like camelProperty & snake_property),
   * and the third one is the default value.
   * @example ```js
   * attach(this, data, { props: [ 'property', [ 'someProperty', 'some_property', false ], [ 'anotherProp', undefined, false ] ] })
   * ```
   */
  props: Array<string | [ string, string?, any? ]>
  /**
   * these properties will be ignored
   * */
  disabled?: Array<string> | readonly [ typeof IgnoreAllSymbol ]
  /**
   * these properties will be added anyway, even if it is specified to ignore them
   * */
  enabled?: Array<string>
}