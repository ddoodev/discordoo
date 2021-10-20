import { BitField } from '@src/api/entities/bitfield/BitField'
import { ReadonlyBitField } from '@src/api/entities/bitfield/ReadonlyBitField'
import { ActivityFlags, ApplicationFlags, SystemChannelFlags, UserFlags } from '@src/constants'

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
