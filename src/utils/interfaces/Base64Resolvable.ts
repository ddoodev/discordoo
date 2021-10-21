import { BufferResolvable } from '@src/utils/interfaces/BufferResolvable'

export type Base64Resolvable = `data:${string}` | BufferResolvable
