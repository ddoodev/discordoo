export const MessageFlags = {
  Crossposted: 1 << 0 as 1,
  IsCrosspost: 1 << 1 as 2,
  SuppressEmbeds: 1 << 2 as 4,
  SourceMessageDeleted: 1 << 3 as 8,
  Urgent: 1 << 4 as 16,
  HasThread: 1 << 5 as 32,
  Ephemeral: 1 << 6 as 64,
  Loading: 1 << 7 as 128,
}
