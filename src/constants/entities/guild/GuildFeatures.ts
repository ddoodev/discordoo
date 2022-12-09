export enum GuildFeatures {
  /** guild has access to set an animated guild banner image */
  AnimatedBanner = 'ANIMATED_BANNER',

  /** Guild has access to set an animated guild icon */
  AnimatedIcon = 'ANIMATED_ICON',

  /** guild has set up auto moderation rules */
  AutoModeration = 'AUTO_MODERATION',

  /** Guild has access to set a guild banner image */
  Banner = 'BANNER',

  /** Guild has access to use commerce features (i.e. create store channels) */
  Commerce = 'COMMERCE',

  /** Guild can enable welcome screen, Membership Screening, stage channels and discovery, and receives community updates */
  Community = 'COMMUNITY',

  /** Guild is able to be discovered in the directory */
  Discoverable = 'DISCOVERABLE',

  /** Guild is able to be featured in the directory */
  Featureable = 'FEATURABLE',

  /** Guild has access to set an invitation splash background */
  InviteSplash = 'INVITE_SPLASH',

  /** Guild has enabled [Membership Screening](https://discord.com/developers/docs/resources/guild#membership-screening-object) */
  MemberVerificationGateEnabled = 'MEMBER_VERIFICATION_GATE_ENABLED',

  /** Guild has access to create news channels */
  News = 'NEWS',

  /** Guild is partnered */
  Partnered = 'PARTNERED',

  /**
   * Guild can be previewed before joining via
   * [Membership Screening](https://discord.com/developers/docs/resources/guild#membership-screening-object)
   * or the directory */
  PreviewEnabled = 'PREVIEW_ENABLED',

  /** Guild has access to set a vanity URL */
  VanityUrl = 'VANITY_URL',

  /** Guild is verified */
  Verified = 'VERIFIED',

  /** Guild has access to set 384kbps bitrate in voice (previously VIP voice servers) */
  VipRegions = 'VIP_REGIONS',

  /** Guild has enabled the welcome screen */
  WelcomeScreenEnabled = 'WELCOME_SCREEN_ENABLED',

  /** Guild has enabled ticketed events */
  TicketedEventsEnabled = 'TICKETED_EVENTS_ENABLED',

  /** Guild has enabled monetization */
  MonetizationEnabled = 'MONETIZATION_ENABLED',

  /** Guild has increased custom sticker slots */
  MoreStickers = 'MORE_STICKERS',

  /** Guild has access to the three-day archive time for threads */
  ThreeDayThreadArchive = 'THREE_DAY_THREAD_ARCHIVE',

  /** Guild has access to the seven-day archive time for threads */
  SevenDayThreadArchive = 'SEVEN_DAY_THREAD_ARCHIVE',

  /** Guild has access to create private threads */
  PrivateThreads = 'PRIVATE_THREADS',
  /** guild is able to set role icons */
  RoleIcons = 'ROLE_ICONS'
}
