export const MessageFlags = {
  Crossposted: 1 << 0 as 1,
  IsCrosspost: 1 << 1 as 2,
  SuppressEmbeds: 1 << 2 as 4,
  SourceMessageDeleted: 1 << 3 as 8,
  Urgent: 1 << 4 as 16,
  HasThread: 1 << 5 as 32,
  Ephemeral: 1 << 6 as 64,
  Loading: 1 << 7 as 128,
  FailedToMentionSomeRolesInThread: 1 << 8 as 256,
  SuppressNotifications: 1 << 12 as 4096,
  IsVoiceMessage: 1 << 13 as 8192,
} as const
