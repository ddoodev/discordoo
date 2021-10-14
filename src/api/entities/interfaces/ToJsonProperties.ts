export type ToJsonProperty = boolean | { override: symbol; value: any } | ToJsonProperties

export interface ToJsonProperties {
  [key: string]: ToJsonProperty
}
