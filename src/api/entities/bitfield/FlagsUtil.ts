import { BitField } from '@src/api/entities/bitfield/BitField'
import { ActivityFlags, ApplicationFlags, SystemChannelFlags, UserFlags } from '@src/constants'

export class ActivityFlagsUtil extends BitField {
  public static FLAGS = ActivityFlags
}

export class ApplicationFlagsUtil extends BitField {
  public static FLAGS = ApplicationFlags
}

export class SystemChannelFlagsUtil extends BitField {
  public static FLAGS = SystemChannelFlags
}

export class UserFlagsUtil extends BitField {
  public static FLAGS = UserFlags
}
