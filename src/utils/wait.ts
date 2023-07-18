import { setTimeout } from 'timers/promises'

export const wait: { (ms: number): Promise<void> } = setTimeout
