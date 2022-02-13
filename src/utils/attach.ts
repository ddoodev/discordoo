import { AttachOptions } from '@src/utils/interfaces/AttachOptions'
import { IgnoreAllSymbol } from '@src/constants/entities/IgnoreAllSymbol'

/**
 * Inserts properties from one object into another.
 * @param to - the object to which the properties are assigned
 * @param from - the object from which the properties are taken
 * @param options - options with properties to be processed
 * */
export function attach(to: any, from: any, options: AttachOptions): void {

  options.props.forEach(property => {
    const type = typeof property === 'string' ? 'string' : Array.isArray(property) ? 'array' : 'unknown'

    switch (type) {
      case 'string': {
        const isInvalid = options.enabled?.includes(property as string)
          ? false
          : options.disabled?.includes(IgnoreAllSymbol as never) || options.disabled?.includes(property as never)

        if (!isInvalid && from[property as string] !== undefined) {
          if (from[property as string] === null) {
            delete to[property as string]
          } else {
            to[property as string] = from[property as string]
          }
        }
      }
      break

      case 'array': {
        const isInvalid = options.enabled?.includes(property[0])
          ? false
          : options.disabled?.includes(IgnoreAllSymbol as never) || options.disabled?.includes(property as never)

        if (!isInvalid) {
          if (from[property[0]] !== undefined) {
            if (from[property[0]] === null) {
              delete to[property[0]]
            } else {
              to[property[0]] = from[property[0]]
            }
          } else if (property[1] !== undefined && from[property[1]] !== undefined) {
            if (from[property[1]] === null) {
              delete to[property[0]]
            } else {
              to[property[0]] = from[property[1]]
            }
          } else if (property[2] !== undefined && to[property[0]] === undefined) {
            to[property[0]] = property[2]
          }
        }
      }
      break
    }
  })
}
