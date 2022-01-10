<p align="center">
  <a href="https://ddoo.dev/"><img width="520" src="https://cdn.discordapp.com/attachments/531549268033404928/924729757583700020/ddoologo_v2_banner.svg" alt=""></a>
</p>


<p align="center">
  <b>
    Discord bots. Simplified and boosted
    <span> · </span>
    <a href="https://ddoo.dev/">Docs & Guide</a>
    <span> · </span>
    <a href="https://github.com/Discordoo/discordoo/blob/develop/CONTRIBUTING.md">Contribute</a>
  </b>
</p>

<p align="center">
  <a href="https://github.com/Discordoo/discordoo/actions">
    <img src="https://github.com/Discordoo/discordoo/workflows/Tests/badge.svg" alt="Testing status" />
  </a>
  <a href="https://github.com/Discordoo/discordoo/actions">
    <img src="https://github.com/Discordoo/discordoo/workflows/Lint/badge.svg" alt="Linting status" />
  </a>
  <a href="https://github.com/Discordoo/discordoo/actions">
    <img src="https://github.com/Discordoo/discordoo/workflows/Build/badge.svg" alt="Build status" />
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

## About
[Discordoo](https://discordoo.xyz/) is a [Discord API](https://discord.com/developers/docs/intro) library interface. 
It was built from ground-up to provide better and faster APIs, both internal and external, than existing [Node.js](https://nodejs.org/) libraries offer.

## Features
* **Very scalable in any way** — inter-machines sharding (PLANNED IN 1.2), custom modules for events queue (someone should create an appropriate provider)
* **Really fast** — this is not a promise, but real tests!
* **Convenient to development** — we create predictable APIs and take care of the convenience of development
* **Caching policies** — do not store a cache that your bot does not need (PLANNED IN 1.0)
* **Flexible in everything** — you can replace parts of the library as you need using our providers (PLANNED IN 1.0)
* **Safe for large bots** — global-rate-limit synchronization between shards on one machine (PLANNED IN 1.0), the ability to limit the number of events sent by gateway to your bot per second (PLANNED IN 1.3)
* **Convenient to monitor** — any statistics, from v8 to events per second, are available for each sharding instance (PLANNED IN 1.2)
* **Good TypeScript support** — the library written in TypeScript, so we naturally support integration with TypeScript well
* **Tested** — critical components tested using various benchmarks, including testing using deep-monitoring systems like [N|Solid](https://nodesource.com/products/nsolid)

## Let's start
Node.js v12.18 or newer required.
1. [Installing](https://docs.discordoo.xyz/base-guide/installing/)
2. [First code & starting](https://docs.discordoo.xyz/base-guide/starting/)

## Benchmarks
While the library is under development, only Discordoo Collection Benchmarks are available.
### Discord.js collection VS Discordoo collection
You can find these benchmarks [here](https://github.com/Discordoo/collection#djs-collection-vs-ddoo-collection-speed-tests).

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
See [Contributing Guide](https://github.com/Discordoo/discordoo/blob/develop/CONTRIBUTING.md).

## About license
We perfectly understand what the MIT license means. 
We will NOT do with our library the things like that happened with popular library [colors](https://github.com/Marak/colors.js/commit/074a0f8ed0c31c35d13d28632bd8a049ff136fb6). 
It is complete idiocy to hope for sufficient help by writing a couple of tweets, and not receiving it, 
bringing tens of thousands of dollars in losses to both companies and ordinary people. 
These people are not to blame for the fact that your library is licensed under MIT. 
If you need help, contact the appropriate authorities, and do not spoil people's lives because they did not help you when everything was bad for you.
