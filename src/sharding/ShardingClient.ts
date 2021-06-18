import ShardingManager from '@src/sharding/ShardingManager'
import { TypedEmitter } from 'tiny-typed-emitter'
import { ChildShardingModes, ShardingModes } from '@src/core/Constants'

export default class ShardingClient extends TypedEmitter {

}

const manager = new ShardingManager({
  mode: ShardingModes.MACHINES,
  machines: {
    me: 'parent',
    points: [
      {
        port: 8379,
        host: '10.0.18.1',
        udp: 'udp4',
        shards: [ 0, 1 ],
        childManagerOptions: {
          mode: ChildShardingModes.PROCESSES,
        },
        tls: {
          public: '../tls/server.pub',
          private: '../tls/server.key',
          dhparam: '../tls/dhparam.pem',
          requestCert: true,
          rejectUnauthorized: true,
          trustedConnections: [ '../tls/10-0-18-1.pub', '../tls/FE80::0202:B3FF:FE1E:8329.pub' ]
        },
      },
      {
        port: 8379,
        host: 'FE80::0202:B3FF:FE1E:8329',
        udp: 'udp6',
        shards: [ 2, 3 ],
        childManagerOptions: {
          mode: ChildShardingModes.WORKERS
        },
        tls: {
          public: '../tls/server.pub',
          private: '../tls/server.key',
          dhparam: '../tls/dhparam.pem',
          requestCert: true,
          rejectUnauthorized: true,
          trustedConnections: [ '../tls/10-0-18-1.pub', '../tls/FE80::0202:B3FF:FE1E:8329.pub' ]
        },
      }
    ]
  }
})

manager.start()
