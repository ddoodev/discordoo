import { ReadonlyBigBitField } from '@src/api/entities/bitfield/ReadonlyBigBitField'
import { BigBitFieldResolvable } from '@src/api'
import { resolveBigBitField } from '@src/utils/resolve'

export abstract class BigBitField extends ReadonlyBigBitField {
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
