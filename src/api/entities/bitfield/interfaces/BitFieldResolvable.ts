import { ReadonlyBitField } from '@src/api/entities/bitfield/ReadonlyBitField'

export type BitFieldResolvableCell<BitFieldClass extends ReadonlyBitField = ReadonlyBitField>
  = number | { bits: number } | BitFieldClass

export type BitFieldResolvable<BitFieldClass extends ReadonlyBitField = ReadonlyBitField>
  = BitFieldResolvableCell<BitFieldClass> | BitFieldResolvableCell<BitFieldClass>[]
