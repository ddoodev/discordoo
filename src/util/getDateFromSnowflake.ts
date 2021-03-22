export default function getDateFromSnowflake(snowflake: string): Date {
  return new Date(+snowflake / 4194304 + 1420070400000)
}