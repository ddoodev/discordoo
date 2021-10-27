import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { PermissionOverwritesData } from '@src/api/entities/overwrites/interfaces/PermissionOverwritesData'
import { PermissionOverwriteTypes } from '@src/constants'
import { attach } from '@src/utils'
import { Json, ReadonlyPermissions, ToJsonProperties } from '@src/api'

export class PermissionsOverwrite extends AbstractEntity {
  public type!: PermissionOverwriteTypes
  public allow!: ReadonlyPermissions
  public deny!: ReadonlyPermissions

  async init(data: PermissionOverwritesData): Promise<this> {
    attach(this, data, [
      'type',
      'allow',
      'deny'
    ])

    if (!(this.allow instanceof ReadonlyPermissions)) {
      this.allow = new ReadonlyPermissions(this.allow)
    }

    if (!(this.deny instanceof ReadonlyPermissions)) {
      this.deny = new ReadonlyPermissions(this.deny)
    }

    return this
  }

  toJson(properties: ToJsonProperties = {}, obj?: any): Json {
    return super.toJson({
      ...properties,
      type: true,
      allow: true,
      deny: true,
    }, obj)
  }

}
