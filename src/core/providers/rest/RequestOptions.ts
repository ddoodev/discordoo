export default interface RequestOptions {
  headers: Record<string, string>,
  body: string | Record<string, string>
}