export function Final(...properties: Array<string | symbol>) {
  return function <T extends {new(...props: any[]): any}>(target: T): T {
    return class extends target {
      constructor(...props: any[]) {
        super(...props)

        properties.forEach(property => {
          Object.defineProperty(this, property, {
            writable: false,
            configurable: false,
            enumerable: true,
            // @ts-ignore
            value: super[property] ?? this[property]
          })
        })
      }
    }
  }
}
