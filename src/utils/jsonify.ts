import { BIG_INT_POINTER } from '@src/constants'

export function jsonify(data: any, returnString?: boolean): any {
  if (Array.isArray(data)) return data.map(d => jsonify(d, returnString))

  if (data) {
    if (returnString) {
      if (typeof data.jsonify === 'function') return JSON.stringify(data.jsonify())
      return JSON.stringify(data)
    } else {

      const stringify = (k: string, v: any) => {
        if (typeof v === 'bigint') {
          return BIG_INT_POINTER + v.toString()
        }

        return v
      }

      if (typeof data.jsonify === 'function') return data.jsonify()
      return JSON.parse(JSON.stringify(data, stringify))
    }
  }

  return data
}

export function fromJson(data: any) {
  const parse = (k: string, v: any) => {
    if (typeof v === 'string' && v.startsWith(BIG_INT_POINTER)) {
      return BigInt(v.slice(BIG_INT_POINTER.length))
    }

    return v
  }

  return JSON.parse(JSON.stringify(data), parse)
}
