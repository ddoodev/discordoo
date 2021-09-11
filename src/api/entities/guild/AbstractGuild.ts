import { AbstractEntity } from '@src/api/entities/AbstractEntity'
import { Client } from '@src/core'

interface GuildData<A extends 'available' | 'unavailable' = 'available'> {
  id: string
  name: A extends 'available' ? string : undefined
  available: A extends 'available' ? true : false
}

class Guild<A extends 'available' | 'unavailable' = 'available'> extends AbstractEntity implements GuildData<A> {
  id!: string
  name!: A extends 'available' ? string : undefined
  available!: A extends 'available' ? true : false

  private _data: GuildData<A>

  constructor(client: Client, data: GuildData<A>) {
    super(client)
    this._data = data
  }

  async init() {
    this.id = this._data.id
    this.name = this._data.name
    this.available = this._data.available

    return this
  }
}

type idk = Guild<'unavailable'> | Guild

function idk1(g: idk) {
  if (g.available) {
    console.log(g.name)
  } else {
    console.log(g.name)
  }
}
