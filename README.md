<p align="center">
  <a href="https://ddoo.dev/"><img width="520" src="https://cdn.discordapp.com/attachments/531549268033404928/924729757583700020/ddoologo_v2_banner.svg" alt=""></a>
</p>


<p align="center">
  <b>
    Discord bots. Simplified and boosted
    <span> · </span>
    <a href="https://docs.ddoo.dev/">Docs & Guide</a>
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

## Philosophy
At Discordoo, we rethought the concept of a Discord bot and came to the conclusion that a Discord bot does not differ much from an HTTP REST backend in its essence. The key similarity between a backend and a Discord bot is that both respond to requests. The difference is that a backend responds to HTTP requests, while a Discord bot responds to Discord gateway events or even Discord's HTTP requests via Discord's HTTP API. Therefore, we took and brought familiar concepts from backends to the library for Discord like dependency injection, providers, controllers, etc.

While there are already projects like [Necord](https://github.com/necordjs/necord), they use libraries created long ago like discord.js and eris under the hood, which due to problems with architecture cannot offer the same as us. Also, such projects are mostly based on NestJS, which is just not designed for such things. We decided to fix it all.

## Getting Started
Process to [installation guide](https://docs.ddoo.dev/guide/overview/install) or [API reference](https://docs.ddoo.dev/ref).

## Planned features
* **Waifoo** — a framework for creating discord bots based on Discordoo (commands, other features).
* **Kawaioo** — a library / nestjs microservice that will allow you to interact with the Discordoo ShardingManager over TCP and UDP, to create your own scalable Rest API for the bot.
* **Voice support** — at this moment, the library does not support voice.
* **Microservices** — injection of microservices into the DiscordApplication that can communicate with each other.

## Release milestone
A complete description of everything that must be in Discordoo to be released

Release deadline: When it's ready.

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
  * [x] User must be able to restart specified shard(s)
  * [x] User must be able to destroy shard(s)
  * [ ] User must be able to get shard(s) statistics
    * [ ] v8 statistics
    * [ ] custom statistics
    * [ ] events per gateway shard per second
    * [ ] common statistics (guilds in cache, users in cache, channels in cache, etc.)
  * [x] User-friendly sharding APIs in sharding instances
  
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
  * [x] Cache must handle InvitesCachingPolicy
  * [x] Cache must handle StickersCachingPolicy
  * [x] Cache must handle CommandsCachingPolicy
  * [x] All the policies listed above must be able to handle custom caching functions

SID - still in development
  
### Entities (discord structures)
* [x] Must be extendable
* [x] Anti monkey-patch defence
* [x] Implement Guilds (SID)
* [x] Implement Messages
* [x] Implement Channels (SID)
* [x] Implement Members
* [x] Implement Emojis
* [x] Implement Stickers
* [x] Implement Roles
* [x] Implement Presences
* [x] Implement Reactions
* [x] Implement Users
* [x] Implement Interactions
* [x] Implement Overwrites (SID)
* [x] Implement Invites (SID)

### User-land APIs
* [x] Collection
* [x] Wrapper
* [x] BitField wrappers
* [x] Entities managers
  * [x] EntitiesManager
  * [x] EntitiesCacheManager
  * [x] ApplicationGuildsManager (SID)
  * [x] ChannelMessagesManager/ApplicationMessagesManager (SID)
  * [x] GuildChannelsManager/ApplicationChannelsManager (SID)
  * [x] GuildEmojisManager/ApplicationEmojisManager (SID)
  * [x] GuildRolesManager/ApplicationRolesManager (SID)
  * [x] GuildPresencesManager/ApplicationPresencesManager
  * [x] GuildMembersManager/ApplicationGuildMembersManager (SID)
  * [x] ThreadMembersManager/ApplicationThreadMembersManager (SID)
  * [x] MessageReactionsManager/ApplicationReactionsManager
  * [x] UsersManager (SID)
  * [x] ApplicationInteractionsManager/ApplicationInteractionsApplicationCommandsManager/GuildApplicationCommandsManager
  * [x] ApplicationInvitesManager/GuildInvitesManager (SID)

## Contributing
Feel free to create a PR, but check if there is an existing one.
See [Contributing Guide](https://github.com/ddoodev/discordoo/blob/develop/CONTRIBUTING.md).
