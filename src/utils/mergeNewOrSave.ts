import { WebSocketUtils } from '@src/utils/WebSocketUtils'

export function mergeNewOrSave(to: any, from: any, props: Array<string | [ string, string ]>): void {
  console.log('FROM', from, 'PROPS', props)
  props.forEach(property => {
    if (typeof property === 'string' && WebSocketUtils.exists(from[property])) {
      to[property] = from[property]
    } else if (Array.isArray(property)) {
      WebSocketUtils.exists(from[property[0]])
        ? to[property[0]] = from[property[0]]
        : WebSocketUtils.exists(from[property[1]])
          ? to[property[0]] = from[property[1]]
        : undefined
    }
  })
}
