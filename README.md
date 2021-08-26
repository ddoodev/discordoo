<p align="center">
  <a href="https://docs.discordoo.xyz"><img width="420" src="https://user-images.githubusercontent.com/44965055/118376907-70cad500-b5d3-11eb-95c2-3397a3882163.png" alt=""></a>
</p>

<p align="center">
  <b>
    Discord bots. Simplified and boosted
    <span> · </span>
    <a href="https://docs.discordoo.xyz">Docs & Guide</a>
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
  <a href="https://discord.gg/eHC8ynn2H3">
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
* **Very scalable in any way** — inter-machines sharding, custom modules for events queue
* **Really fast** — this is not a promise, but real tests
* **Convenient to development** — we create predictable APIs and take care of the convenience of development
* **Caching policies** — do not store a cache that your bot does not need
* **Flexible in everything** — you can replace parts of the library as you need using our providers
* **Safe for large bots** — global-rate-limit synchronization between shards on one machine, the ability to limit the number of events sent by gateway to your bot per second
* **Convenient to monitor** — any statistics, from v8 to eventloop lag and events per second, are available for each sharding instance
* **Good TypeScript support** — the library written in TypeScript, so we naturally support integration with TypeScript well
* **Well-documented** — instructions for everything, starting from the installation, ending with inter-machines sharding
* **Tested** — critical components tested using various benchmarks, including testing using N|Solid platform

## Let's start
Node.js v12.18 or newer required.
1. [Installing](https://docs.discordoo.xyz/base-guide/installing/)
2. [First code & starting](https://docs.discordoo.xyz/base-guide/starting/)

## Benchmarks
While the library is under development, only Discordoo Collection Benchmarks are available.
### D.js collection VS ddoo collection
You can find these benchmarks [here](https://github.com/Discordoo/collection#djs-collection-vs-ddoo-collection-speed-tests).

## Planned features
* **Waifoo** — a framework for creating discord bots based on Discordoo (commands, other features).
* **Kawaioo** — a library / nestjs microservice that will allow you to interact with the Discordoo ShardingManager over TCP and UDP, to create your own scalable REST API for the bot.
* **Voice support** — at this moment, the library does not support voice.
* **Microservices** — injection of microservices into the Client that can communicate with each other.

## Release milestone
A complete description of everything that must be in Discordoo to be released

Release deadline: October 30, 2021
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
    * [ ] eventloop lag
    * [ ] custom statistics
    * [ ] events per gateway shard per second statistics
    * [ ] common statistics (guilds in cache, users in cache, channels in cache, other)
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
* [ ] Send events to WebSocketManager, and then to GatewayProvider
* [ ] Gateway must be able to restart only specified shard(s)

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
* [x] Library must be able to sweep cache using predicate and cycle 
* [x] Library must be able to iterate cache
* [x] Library must be able to operate with cache in a different shards from one shard
* [x] Caching policies
  * [x] Cache must handle GlobalCachingPolicy
  * [ ] Cache must handle MessagesCachingPolicy
  * [ ] Cache must handle GuildsCachingPolicy
  * [ ] Cache must handle MembersCachingPolicy
  * [ ] Cache must handle ChannelsCachingPolicy
  * [ ] Cache must handle EmojisCachingPolicy
  * [ ] Cache must handle RolesCachingPolicy
  * [ ] Cache must handle PresencesCachingPolicy
  * [ ] Cache must handle UsersCachingPolicy
  * [x] All the policies listed above must be able to handle custom caching functions
  
### Entities (discord structures)
* [x] Must be extendable
* [x] Anti monkey-patch defence
* [ ] Implement Guilds
* [ ] Implement Messages
* [ ] Implement Channels
* [ ] Implement Emojis
* [ ] Implement Roles
* [ ] Implement Presences
* [ ] Implement Users

### User-land APIs
* [x] Collection
* [x] Wrapper
* [ ] Entities managers
  * [ ] BaseManager
  * [ ] GuildsManager
  * [ ] MessagesManager
  * [ ] ChannelsManager
  * [ ] EmojisManager
  * [ ] RolesManager
  * [ ] PresencesManager
  * [ ] UsersManager

## Contributing
Feel free to create a PR, but check if there is an existing one.
See [Contributing Guide](https://github.com/Discordoo/discordoo/blob/develop/CONTRIBUTING.md).
