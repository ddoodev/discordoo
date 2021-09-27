export type ToJsonProperty = boolean | ToJsonProperties

export interface ToJsonProperties {
  [key: string]: ToJsonProperty
}
