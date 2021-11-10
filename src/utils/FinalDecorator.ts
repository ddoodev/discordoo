/**
 * This decorator makes class props/methods non overridable in extended classes.
 *
 * When someone extends the class that decorated with @Final('method') and tries to override protected method,
 * and then executes overridden method, the code from the source class will be executed.
 *
 * Also this decorator hides the method code when method.toString() called.
 *
 * @example ```ts
 * @Final('hello')
 * class Test { // decorated with @Final('hello')
 *   hello() {
 *     return 'world'
 *   }
 * }
 *
 * class Test2 extends Test {
 *   hello() {
 *     return 'hi'
 *   }
 * }
 *
 * console.log(new Test2().hello()) // 'world'
 * ```
 * */
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
