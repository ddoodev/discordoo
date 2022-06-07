import { ReadonlyPermissions } from '@src/api/entities/bitfield/ReadonlyPermissions'
import { BigBitField } from '@src/api/entities/bitfield/BigBitField'
import { BigBitFieldResolvable } from '@src/api'
import { resolveBigBitField } from '@src/utils/resolve'

export class Permissions extends ReadonlyPermissions implements BigBitField {
  public declare bitfield: bigint

  add(bits: BigBitFieldResolvable): this {
    this.bitfield |= (this.emptyBit | resolveBigBitField(bits))
    return this
  }

  remove(bits: BigBitFieldResolvable): this {
    this.bitfield &= (~(this.emptyBit | resolveBigBitField(bits)))
    return this
  }
}
