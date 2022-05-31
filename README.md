<p align="center">
  <a href="https://ddoo.dev/"><img width="520" src="https://cdn.discordapp.com/attachments/531549268033404928/924729757583700020/ddoologo_v2_banner.svg" alt=""></a>
</p>


<p align="center">
  <b>
    Discord bots. Simplified and boosted
    <span> · </span>
    <a href="https://ddoo.dev/">Docs & Guide</a>
    <span> · </span>
    <a href="https://github.com/ddoodev/discordoo/blob/develop/CONTRIBUTING.md">Contribute</a>
  </b>
</p>

<p align="center">
  <a href="https://github.com/ddoodev/discordoo/actions">
    <img src="https://github.com/ddoodev/discordoo/workflows/Tests/badge.svg" alt="Testing status" />
  </a>
  <a href="https://github.com/ddoodev/discordoo/actions">
    <img src="https://github.com/ddoodev/discordoo/workflows/Lint/badge.svg" alt="Linting status" />
  </a>
  <a href="https://github.com/ddoodev/discordoo/actions">
    <img src="https://github.com/ddoodev/discordoo/workflows/Build/badge.svg" alt="Build status" />
  </a>
  <a href="https://ddoo.dev/discord">
    <img 
      src="https://img.shields.io/discord/811663819721539674?color=7280DA&label=Discord&logo=discord&logoColor=white" 
      alt="Online"
    >
  </a>
</p>
<hr>

## WARNING
**THIS LIBRARY IS UNDER DEVELOPMENT!** Parts of the stuff described here is not done yet, and we are just planning to implement it.
You can find out more information about the development in our [Discord](https://ddoo.dev/).

## About
[Discordoo](https://ddoo.dev/) is a [Discord API](https://discord.com/developers/docs/intro) library interface. 
It was built from ground-up to provide better and faster APIs, both internal and external, than existing [Node.js](https://nodejs.org/) libraries offer.

## Features
### Scalable. Too much
Using providers system, you can change the behavior of the library in ways you never imagined before.

#### Let's imagine that you have Infinity guilds, and you need to save the resources of your hosting servers as much as possible, and also not have a minute of downtime.
To do this, you need to distribute the bot to a bunch of hosting servers, 
separate the gateway and the executable part of the bot, 
and also somehow link the library cache to the executable part of the bot, while you need to comply with the GRL/IRL.

#### How to do this? 
It's simple, with Discordoo you can do it using less than 100 lines of code without even rewriting the existing codebase.
1. **You need to connect a gateway provider** that sends events to some messages broker on servers that should receive messages from gateway, and also connect the same gateway provider on servers that should receive messages (executable part). (such a provider should be written by someone else, or you should write it by yourself)
2. **Then you need to connect the cache provider**, which stores the cache in some scalable cache storage, such as redis. (such a provider should be written by someone else, or you should write it by yourself)
3. **Then you need to configure the sharding** so that the machines or node.js instances that have the same IP address 
were connected through our inter-machines sharding managers. (inter-machines sharding manager will be introduced in version 1.0, but you can ignore this point if you have one node.js instance each for one IP address.)
4. **That is all.** Imagine, in order to expand infinitely and have almost zero downtime, you need to rewrite a hundred lines of code, 80 of which are just configs.

#### Or if you just want to distribute the bot to multiple hosting servers:
Just use inter-machines sharding manager:

**THIS WILL BE INTRODUCED IN VERSION 1.0 AND THE API MAY CHANGE.**
```ts
// index.ts on 10.0.21.3 (this functional planned in 1.0)
import { MachinesShardingManager, ShardingModes, MachinesShardingManagerTypes } from 'discordoo'

const manager = new MachinesShardingManager({
  type: MachinesShardingManagerTypes.INFERIOR,
  file: './dist/bot.js',
  listen: {
    host: '0.0.0.0',
    port: 8379,
    user: 'root',
    password: 'hf4reg74c3g',
    path: 'server'
  },
  tls: {
    cert: './fullchain.pem',
    key: './privkey.pem'
  }
})

manager.start()
```
```ts
// index.ts on 10.0.21.0
import { MachinesShardingManager, ShardingModes } from 'discordoo'

const manager = new MachinesShardingManager({
  type: MachinesShardingManagerTypes.SUPERIOR,
  points: [
    {
      destination: 'ddoo+quic://root:hf4reg74c3g@10.0.21.3:8379/server?o=235',
      options: {
        shards: { from: 0, to: 127 },
        mode: ShardingModes.PROCESSES,
        shardsPerInstance: 4,
      },
      tls: {
        cert: './10.0.21.3-fullchain.pem',
      }
    }
  ]
})

manager.start()
```
That's it. There is no need to rewrite anything other than changing sharding managers.

### Fast
Why write inefficient code? We don't do that. Tests are coming soon.

### Flexible caching
Optimize RAM consumption the way you need it.

#### Caching policies
For example, just disable the unnecessary cache.
```ts
import { createApp, ChannelsCachingPolicy } from 'discordoo'

createApp()
  .cache({
    // cache only dm channels
    channels: {
      policies: [ ChannelsCachingPolicy.DM ]
    }
  })
  .build()
```

#### Removing unnecessary properties
You know that RAM is spent on storing properties, right? 
Redefine the entities in which you want to delete some properties.
Don't worry, you won't be able accidentally break the library this way. We took care of it.
```ts
import { EntitiesUtil, DirectMessagesChannel, createApp } from 'discordoo'

// you can do it like this:
class ExtendedDirectMessagesChannel extends DirectMessagesChannel {
  init(data, options) { // must return Promise<this>
    return super.init(data, {
      ...options,
      ignore: [
        // do not store 'lastPinTimestamp' property
        'lastPinTimestamp',
        // will not work. library uses 'id' property, so you can't delete it
        'id'
      ] // or just [ IgnoreAllSymbol ] to not store anything (import it)
    }) // super.init(data) always is mandatory
  }
}

EntitiesUtil.extend('DirectMessagesChannel', ExtendedDirectMessagesChannel)

// or you can do it like this:
createApp()
  .extenders([
    { entity: 'DirectMessagesChannel', extender: ExtendedDirectMessagesChannel }
  ])
  .build()
```

### Safe
for everyone. From bots with 100 servers, to bots with 10,000,000 servers.
#### Global Rate Limit (GRL) sync
When your bot gets big, it starts to run into global rate limits, so you have to carefully monitor them. Therefore, we made synchronization of this limit between shards.
#### Invalid Request limit (IRL) sync
Sometimes this happens, the bot starts making a lot of invalid requests. If not stop this, discord will block the bot entirely for 1 hour. Therefore, we monitor incorrect requests, and when the limit is almost exhausted, we stop all requests for the time remaining until the limit is reset (max 10 minutes), so that the bot is not blocked for an hour.
#### Restriction of emitted events
It happens that discord sends two or three times more events in a few seconds than usual. This may trigger blocking due to GRL or IRL. Therefore, we have made a progressive system to limit the emitted events. We count how many events have been received up to the current moment, and how many have already been emitted now. If the number of emitted events does not match the specified multiplier, the extra events are sent to the queue and will be emitted later. (PLANNED IN VERSION 1.3)

### Know what's going on
#### Average REST delay
(PLANNED IN VERSION 1.0)
We consider the average delay (TTFB) in executing REST requests. (the implementation may differ if you use a third-party provider)
#### Average Gateway latency
Like all other libraries, information about the WebSocket latency is available. (the implementation may differ if you use a third-party provider)
#### Number of events received/emitted per second
(PLANNED IN VERSION 1.3)
You can track how many events have arrived and how many have been emitted. (the implementation does not depend on provider)
#### Number of ipc messages per second
(THIS IS NOT PLANNED, BUT MAY BE INTRODUCED IN VERSION 1.2)
The number of messages sent received via IPC, per second
#### These statistics are available from the sharing manager
Why not.

### Enterprise code level
#### Good TypeScript support
The library written in TypeScript, so we naturally support integration with TypeScript well
#### Decorators, injections, observables, and more
Just a few examples:
(the API may change, waifoo is under development)
```ts
@service(createDiscordooClient())
@eventListener()
class App {
  constructor(@logger private _logger: Logger) {}

  @on('ready')
  ready(context: ReadyEventContext) {
    this._logger.log(`Client logged in as ${context.client.user.tag}!`)
  }
}

createApp(App).start()
```
```ts
reactions({ message, /* author, */ time: 5000 })
  .subscribe((reaction, observer) => {
    if (something) observer.skip()
    else if (another) observer.stop()
  })
  .end(results => {
    console.log(results) // some reactions received
  })
```
### Tested
Code tested with [N|Solid](https://nodesource.com/products/nsolid).

## Let's start
Node.js v12.18 or newer required.
(there was a guide here, but we're in the process of rewriting, so it's empty for now)

## Benchmarks
While the library is under development, only Discordoo Collection Benchmarks are available.
### Discord.js collection VS Discordoo collection
You can find these benchmarks [here](https://github.com/ddoodev/collection#djs-collection-vs-ddoo-collection-speed-tests).

## Planned features
* **Waifoo** — a framework for creating discord bots based on Discordoo (commands, other features).
* **Kawaioo** — a library / nestjs microservice that will allow you to interact with the Discordoo ShardingManager over TCP and UDP, to create your own scalable REST API for the bot.
* **Voice support** — at this moment, the library does not support voice.
* **Microservices** — injection of microservices into the Client that can communicate with each other.

## Release milestone
A complete description of everything that must be in Discordoo to be released

Release deadline: When it's ready. 
I'm tired of trying to cram an unrealistic amount of work into a couple of days and make commits with 1000 lines at once.
You can blame me for that, I understand this. Sorry.

*please read this*
![image](https://user-images.githubusercontent.com/44965055/147416937-d10a141c-665c-4321-84d5-256979862ddf.png)

### Sharding
* [x] Implement sharding
* [x] Shards spawning
  * [x] use processes for shards
  * [x] use workers for shards
  * [x] use clusters for shards (unfortunately, windows not supported)
* [x] Shards communication
  * [x] Shards must be able to communicate in fast and scalable way
  * [x] Shards must use hello/identify algorithm
  * [ ] Shards must use heartbeat algorithm
  * [x] Shards must be able to send, receive and handle CACHE_OPERATE messages
  * [x] Shards must be able to send errors to ShardingManager, manager must handle these errors 
* [x] User-land APIs
  * [x] User must be able to spawn shards
  * [ ] User must be able to restart specified shard(s)
  * [ ] User must be able to destroy shard(s)
  * [ ] User must be able to get shard(s) statistics
    * [ ] v8 statistics
    * [ ] custom statistics
    * [ ] events per gateway shard per second
    * [ ] common statistics (guilds in cache, users in cache, channels in cache, etc.)
  * [ ] User-friendly sharding APIs in sharding instances
  
### Gateway
* [x] Implement gateway
  * [x] Implement gateway provider
* [x] Connecting to gateway
* [x] Reconnecting/resuming in common/emergency cases
* [x] Receive and send etf encoded messages
* [x] Receive and decode zlib-compressed messages
* [x] Multi gateway shards support in one WebSocketManager instance
* [ ] Processing events/s smoothing/limiting
* [ ] Handling gateway rate limits
* [x] Send events to WebSocketManager, and then to GatewayProvider
* [x] Gateway must be able to restart only specified shard(s)

### Rest
* [x] Implement rest
  * [x] Implement rest provider - rest request (like constructor) & rest provider (performs requests and handles rate-limits optionally)
* [x] Requests
  * [x] Sending requests to Discord
* [x] Responses
  * [x] Unified response form for library internals
* [ ] Rate-limits
  * [ ] Rest must smartly-handle rate-limits using `remaining` header
  * [ ] Rest must synchronize global-rate-limit between shards on one machine
  
### Cache
* [x] Implement cache
  * [x] Implement cache provider
* [x] Library must be able to store something
* [x] Library must be able to delete something from cache
* [x] Library must be able to check cache size
* [x] Library must be able to sweep cache
* [x] Library must be able to iterate cache
* [x] Library must be able to operate with cache in a different shards from one shard
* [x] Caching policies
  * [x] Cache must handle GlobalCachingPolicy
  * [x] Cache must handle MessagesCachingPolicy
  * [x] Cache must handle GuildsCachingPolicy
  * [x] Cache must handle GuildMembersCachingPolicy
  * [x] Cache must handle ThreadMembersCachingPolicy
  * [x] Cache must handle ChannelsCachingPolicy
  * [x] Cache must handle EmojisCachingPolicy
  * [x] Cache must handle RolesCachingPolicy
  * [x] Cache must handle PresencesCachingPolicy
  * [x] Cache must handle UsersCachingPolicy
  * [x] Cache must handle OverwritesCachingPolicy
  * [x] All the policies listed above must be able to handle custom caching functions

SID - still in development
  
### Entities (discord structures)
* [x] Must be extendable
* [x] Anti monkey-patch defence
* [ ] Implement Guilds
* [x] Implement Messages
* [x] Implement Channels (SID)
* [x] Implement Members
* [x] Implement Emojis
* [x] Implement Stickers
* [x] Implement Roles
* [x] Implement Presences
* [x] Implement Reactions
* [x] Implement Users

### User-land APIs
* [x] Collection
* [x] Wrapper
* [x] BitField wrappers
* [x] Entities managers
  * [x] EntitiesManager
  * [x] EntitiesCacheManager
  * [x] GuildsManager (SID)
  * [x] ChannelMessagesManager/ClientMessagesManager (SID)
  * [x] GuildChannelsManager/ClientChannelsManager (SID)
  * [x] GuildEmojisManager/ClientEmojisManager (SID)
  * [x] GuildRolesManager/ClientRolesManager (SID)
  * [x] GuildPresencesManager/ClientPresencesManager
  * [x] GuildMembersManager/ClientGuildMembersManager (SID)
  * [x] ThreadMembersManager/ClientThreadMembersManager (SID)
  * [x] MessageReactionsManager/ClientReactionsManager
  * [x] UsersManager (SID)

## Contributing
Feel free to create a PR, but check if there is an existing one.
See [Contributing Guide](https://github.com/ddoodev/discordoo/blob/develop/CONTRIBUTING.md).
