import { promisify } from 'util'

export const wait: { (ms: number): Promise<void> } = promisify(setTimeout)
