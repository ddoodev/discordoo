import { randomBytes } from 'crypto'

export function randomString(): string {
  return randomBytes(20).toString('hex')
}
