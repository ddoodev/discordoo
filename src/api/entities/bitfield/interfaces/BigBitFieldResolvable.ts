import { BigBitField } from '@src/api/entities/bitfield/BigBitField'

export type BigBitFieldResolvableCell<BigBitFieldClass extends BigBitField = BigBitField>
  = number | { bits: `${number}n` } | `${number}n` | bigint | BigBitFieldClass

export type BigBitFieldResolvable<BigBitFieldClass extends BigBitField = BigBitField>
  = BigBitFieldResolvableCell<BigBitFieldClass> | BigBitFieldResolvableCell<BigBitFieldClass>[]
