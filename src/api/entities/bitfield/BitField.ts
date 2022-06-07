import { ReadonlyBitField } from '@src/api/entities/bitfield/ReadonlyBitField'
import { BitFieldResolvable } from '@src/api'
import { resolveBitField } from '@src/utils/resolve'

export abstract class BitField extends ReadonlyBitField {
  public declare bitfield: number

  add(bits: BitFieldResolvable): this {
    this.bitfield |= (this.emptyBit | resolveBitField(bits))
    return this
  }

  remove(bits: BitFieldResolvable): this {
    this.bitfield &= (~(this.emptyBit | resolveBitField(bits)))
    return this
  }
}
