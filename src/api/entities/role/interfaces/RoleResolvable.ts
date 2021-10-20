import { Resolvable } from '@src/api'
import { Role } from '@src/api/entities/role'
import { RawRoleData } from '@src/api/entities/role/interfaces/RawRoleData'
import { RoleData } from '@src/api/entities/role/interfaces/RoleData'

export type RoleResolvable = Resolvable<Role | RawRoleData | RoleData>
