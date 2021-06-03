import { promisify } from 'util'

const wait: { (ms: number): Promise<void> } = promisify(setTimeout)

export default wait
