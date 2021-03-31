![ddoologo_v1 5](https://user-images.githubusercontent.com/44965055/113192570-98562000-9267-11eb-966f-ea562bbb1f85.png)

## Table of contents
- [About](#about)
- [Status](#status)  
- [Packages](#packages)
- [Contributing](#contributing)

## About
Discordoo is a modular and powerful node.js library to interact with the Discord API.

We have now:
- Powerful types
- Modular

And we plan:
- Powerful cache management
- Fully customizable sharding
- Modules optimized for high load
- Modules from third-party developers

## Status
Discord API Coverage: 0%

## Packages
Discordoo has the only root package - `discordoo`.
It contains all modules and stuff.

Name | Description
--- | ---
cache | Implements caching logic
collection | An utillity data structure which is used within the library
core | Contains pure client and interface that modules have to implement
main | Exports everything from every module and contains client with preloaded modules
rest | Works with Discord's HTTP API
util | Internal things for the library
ws | Works with Discord's gateway via WebSocket

## Contributing
Feel free to create a PR, but check if there is an existing one.
See [Contributing Guide](https://github.com/Discordoo/discordoo/blob/master/CONTRIBUTING.md).
