import { RawActionRowData } from '@src/api'

export interface RawModalData {
  custom_id: string
  title: string
  components: RawActionRowData[]
}
