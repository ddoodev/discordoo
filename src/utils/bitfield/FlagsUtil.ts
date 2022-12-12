import { BitField } from '@src/utils/bitfield/BitField'
import { ReadonlyBitField } from '@src/utils/bitfield/ReadonlyBitField'
import { ActivityFlags, ApplicationFlags, MessageFlags, SystemChannelFlags, ThreadMemberFlags, UserFlags } from '@src/constants'

export class ActivityFlagsUtil extends BitField {
  public static FLAGS = ActivityFlags
}

export class ReadonlyActivityFlagsUtil extends ReadonlyBitField {
  public static FLAGS = ActivityFlags
}

export class ApplicationFlagsUtil extends BitField {
  public static FLAGS = ApplicationFlags
}

export class ReadonlyApplicationFlagsUtil extends ReadonlyBitField {
  public static FLAGS = ApplicationFlags
}

export class SystemChannelFlagsUtil extends BitField {
  public static FLAGS = SystemChannelFlags
}

export class ReadonlySystemChannelFlagsUtil extends ReadonlyBitField {
  public static FLAGS = SystemChannelFlags
}

export class UserFlagsUtil extends BitField {
  public static FLAGS = UserFlags
}

export class ReadonlyUserFlagsUtil extends ReadonlyBitField {
  public static FLAGS = UserFlags
}

export class MessageFlagsUtil extends BitField {
  public static FLAGS = MessageFlags
}

export class ReadonlyMessageFlagsUtil extends ReadonlyBitField {
  public static FLAGS = MessageFlags
}

export class ThreadMemberFlagsUtil extends BitField {
  public static FLAGS = ThreadMemberFlags
}

export class ReadonlyThreadMemberFlagsUtil extends ReadonlyBitField {
  public static FLAGS = ThreadMemberFlags
}
