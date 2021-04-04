export default interface Bucket {
  limit: number,
  remaining: number,
  reset: Date,
  global: boolean
}