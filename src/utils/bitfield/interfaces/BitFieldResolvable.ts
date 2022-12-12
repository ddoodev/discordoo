import { ReadonlyBitField } from '@src/utils/bitfield/ReadonlyBitField'

export type BitFieldResolvableCell<BitFieldClass extends ReadonlyBitField = ReadonlyBitField>
  = number | { bits: number } | BitFieldClass

export type BitFieldResolvable<BitFieldClass extends ReadonlyBitField = ReadonlyBitField>
  = BitFieldResolvableCell<BitFieldClass> | BitFieldResolvableCell<BitFieldClass>[]
