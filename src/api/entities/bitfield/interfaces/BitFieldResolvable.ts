import { BitField } from '@src/api/entities/bitfield/BitField'

export type BitFieldResolvableCell<BitFieldClass extends BitField = BitField>
  = number | BitFieldClass

export type BitFieldResolvable<BitFieldClass extends BitField = BitField>
  = BitFieldResolvableCell<BitFieldClass> | BitFieldResolvableCell<BitFieldClass>[]
