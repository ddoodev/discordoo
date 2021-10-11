import { BigBitFieldResolvable } from '@src/api/entities/bitfield/interfaces'
import { EmptyBigBit } from '@src/constants'
import { Json } from '@src/api/entities/interfaces/Json'
import { resolveBigBitField } from '@src/utils/resolve'

export abstract class BigBitField {
  public static FLAGS: Record<string, bigint>
  public bitfield: bigint
  public emptyBit = EmptyBigBit

  constructor(bits: BigBitFieldResolvable = EmptyBigBit) {
    this.bitfield = resolveBigBitField(bits, this.emptyBit)
  }

  hasAny(bits: BigBitFieldResolvable): boolean {
    return (this.bitfield & resolveBigBitField(bits, this.emptyBit)) !== this.emptyBit
  }

  equals(bits: BigBitFieldResolvable): boolean {
    return this.bitfield === resolveBigBitField(bits, this.emptyBit)
  }

  has(bits: BigBitFieldResolvable): boolean {
    const bit = resolveBigBitField(bits, this.emptyBit)
    return (this.bitfield & bit) === bit
  }

  missing(bits: BigBitFieldResolvable): this {
    return new (this.constructor as any)().remove(bits)
  }

  add(bits: BigBitFieldResolvable): this {
    this.bitfield |= (this.emptyBit | resolveBigBitField(bits))
    return this
  }

  remove(bits: BigBitFieldResolvable): this {
    this.bitfield &= (~(this.emptyBit | resolveBigBitField(bits)))
    return this
  }

  serialize(): Record<string, boolean> {
    const result: Record<string, boolean> = {}

    for (const [ flag, bit ] of Object.entries((this.constructor as any).FLAGS)) {
      if (typeof bit === 'bigint') result[flag] = this.has(bit)
    }

    return result
  }

  toArray(): string[] {
    const result: string[] = []

    for (const [ flag, bit ] of Object.entries((this.constructor as any).FLAGS)) {
      if (typeof bit === 'bigint' && this.has(bit)) result.push(flag)
    }

    return result
  }

  toJson(): Json {
    return { bits: this.bitfield.toString() + 'n' }
  }
}
