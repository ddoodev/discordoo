import { BitFieldResolvable } from '@src/api/entities/bitfield/interfaces'
import { resolveBitField } from '@src/utils/resolve'
import { EmptyBit } from '@src/constants'
import { Json } from '@src/api/entities/interfaces/Json'

export abstract class BitField {
  public static FLAGS: Record<string, number>
  public bitfield: number
  public emptyBit = EmptyBit

  protected constructor(bits: BitFieldResolvable = EmptyBit) {
    this.bitfield = resolveBitField(bits, this.emptyBit)
  }

  hasAny(bits: BitFieldResolvable): boolean {
    return (this.bitfield & resolveBitField(bits, this.emptyBit)) !== this.emptyBit
  }

  equals(bits: BitFieldResolvable): boolean {
    return this.bitfield === resolveBitField(bits, this.emptyBit)
  }

  has(bits: BitFieldResolvable): boolean {
    const bit = resolveBitField(bits, this.emptyBit)
    return (this.bitfield & bit) === bit
  }

  missing(bits: BitFieldResolvable): this {
    return new (this.constructor as any)().remove(bits)
  }

  add(bits: BitFieldResolvable): this {
    this.bitfield |= (this.emptyBit | resolveBitField(bits))
    return this
  }

  remove(bits: BitFieldResolvable): this {
    this.bitfield &= (~(this.emptyBit | resolveBitField(bits)))
    return this
  }

  serialize(): Record<string, boolean> {
    const result: Record<string, boolean> = {}

    for (const [ flag, bit ] of Object.entries((this.constructor as any).FLAGS)) {
      if (typeof bit === 'number') result[flag] = this.has(bit)
    }

    return result
  }

  toArray(): string[] {
    const result: string[] = []

    for (const [ flag, bit ] of Object.entries((this.constructor as any).FLAGS)) {
      if (typeof bit === 'number' && this.has(bit)) result.push(flag)
    }

    return result
  }

  toJson(): Json {
    return { bits: this.bitfield }
  }
}
