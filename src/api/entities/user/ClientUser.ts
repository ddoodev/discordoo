import { RawUserData, User, UserData } from '@src/api'

export class ClientUser extends User {
  
  async init(data: UserData | RawUserData): Promise<this> {
    return super.init(data)
  }

}
