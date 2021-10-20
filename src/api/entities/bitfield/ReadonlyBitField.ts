import { BitFieldResolvable } from '@src/api/entities/bitfield/interfaces'
import { resolveBitField } from '@src/utils/resolve'
import { EmptyBit } from '@src/constants'
import { Json } from '@src/api/entities/interfaces/Json'

export abstract class ReadonlyBitField {
  public static FLAGS: Readonly<Record<string, number>>
  public bitfield: Readonly<number>
  public emptyBit = EmptyBit

  constructor(bits: BitFieldResolvable = EmptyBit) {
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
    const has = this.bitfield & (~(this.emptyBit | resolveBitField(bits)))
    const missing = this.bitfield & (~(this.emptyBit | has))

    return new (this.constructor as any)(missing)
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

  toString(): string {
    return this.bitfield.toString()
  }

  toJson(): Json {
    return { bits: this.bitfield }
  }
}
