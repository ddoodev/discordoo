export function mergeNewOrSave(to: any, from: any, props: Array<string | [ string, string ]>): void {
  props.forEach(property => {
    if (typeof property === 'string' && property in from) {
      to[property] = from[property]
    } else {
      property[0] in from ? to[property[0]] = from[property[0]] : property[1] in from ? to[property[0]] = from[property[1]] : undefined
    }
  })
}
