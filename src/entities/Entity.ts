export abstract class Entity {
  toJSON(properties: any[], returnProps?: boolean) {
    if (returnProps) return properties // used for correct processing in init()

    const result = {}

    for (const property of properties) {
      const data = this[property], type = typeof data

      if (data === undefined) continue

      switch (true) {
        case data?.toJSON !== undefined:
          result[property] = data.toJSON()
          break
        case (type !== 'function' && type !== 'bigint' && type !== 'symbol') || data === null:
          result[property] = data
          break
        case type === 'bigint':
          result[property] = data.toString()
          break
      }
    }
  }

  private _handleProperty(data: any, properties: any[]) {
    const type = typeof data
  }
}
