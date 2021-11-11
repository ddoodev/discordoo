import { Resolvable } from '@src/api'
import { ThreadMember } from '@src/api/entities/member/ThreadMember'
import { ThreadMemberData } from '@src/api/entities/member/interfaces/ThreadMemberData'
import { RawThreadMemberData } from '@src/api/entities/member/interfaces/RawThreadMemberData'

export type ThreadMemberResolvable = Resolvable<ThreadMember | ThreadMemberData | RawThreadMemberData>
