import { ReadonlyBigBitField } from '@src/api/entities/bitfield/ReadonlyBigBitField'

export type BigBitFieldResolvableCell<BigBitFieldClass extends ReadonlyBigBitField = ReadonlyBigBitField>
  = number | { bits: `${number}n` } | string | `${number}n` | bigint | BigBitFieldClass

export type BigBitFieldResolvable<BigBitFieldClass extends ReadonlyBigBitField = ReadonlyBigBitField>
  = BigBitFieldResolvableCell<BigBitFieldClass> | BigBitFieldResolvableCell<BigBitFieldClass>[]
