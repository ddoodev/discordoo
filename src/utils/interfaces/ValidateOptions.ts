import JsonSchema from 'json-schema'

export interface ValidateOptions {
  schema: JsonSchema.JSONSchema7
  department?: string
  wantResult?: boolean
  instance?: string
}
