export const SystemChannelFlags = {
  SuppressJoinNotifications: 1 << 0,
  SuppressPremiumSubscriptions: 1 << 1,
  SuppressGuildReminderNotifications: 1 << 2,
  SuppressJoinNotificationReplies: 1 << 3,
  SuppressRoleSubscriptionsPurchaseNotifications: 1 << 4,
  SuppressRoleSubscriptionPurchaseNotificationReplies: 1 << 5,
} as const
