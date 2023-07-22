import { Resolvable } from '@src/api'
import { User } from '@src/api/entities/user/User'
import { UserData } from '@src/api/entities/user'
import { RawUserData } from '@src/api/entities/user/interfaces/RawUserData'

export type UserResolvable = Resolvable<User | UserData | RawUserData>
