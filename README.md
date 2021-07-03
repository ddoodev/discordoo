<p align="center">
<img width="420" src="https://user-images.githubusercontent.com/44965055/118376907-70cad500-b5d3-11eb-95c2-3397a3882163.png" alt="">
</p>
<p align="center">
<b>Discord bots. Simplified and boosted</b>
</p>

<p align="center">
  <a href="https://discord.gg/TFZtXeYVM5">
    <img 
      src="https://img.shields.io/discord/811663819721539674?color=purple&label=Discord&style=for-the-badge" 
      alt="Online"
    >
  </a>
</p> 

<p align="center">
<a href="https://docs.discordoo.xyz">Docs & Guide</a>
<span> · </span>
<a href="https://github.com/Discordoo/discordoo/blob/master/CONTRIBUTING.md">Contribute</a>
</p> 

<hr>

## WARNING
**THIS LIBRARY UNDER DEVELOPMENT!** Parts of the stuff described here is not done yet, and we are just planning to implement it.

## About
[Discordoo](https://discordoo.xyz/) is a [Discord API](https://discord.com/developers/docs/intro) library interface. 
It was built from ground-up to provide better and faster APIs, both internal and external, than existing [Node.js](https://nodejs.org/) libraries offer.

## Features
* **Very scalable in any way** — inter-machines sharding, custom modules for events queue
* **Really fast** — this is not a promise, but real tests
* **Convenient to development** — we create predictable APIs and take care of the convenience of development
* **Caching policies** — do not store a cache that your bot does not need
* **Flexible in everything** — you can replace parts of the library as you need using our providers
* **Safe for large bots** — global-rate-limit synchronization between shards and machines, the ability to limit the number of events sent by gateway to your bot per second
* **Convenient to monitor** — any statistics, from v8 to eventloop lag and events per second, are available for each sharding instance
* **Good TypeScript support** — the library written in TypeScript, so we naturally support integration with TypeScript well
* **Well-documented** — instructions for everything, starting from the installation, ending with inter-machines sharding
* **Tested** — critical components tested using various benchmarks, including testing using N|Solid platform

## Let's start
Instructions for creating the first bot with Discordoo can be found in our documentation:
1. [Installing](https://docs.discordoo.xyz/base-guide/installing/)
2. [First code & starting](https://docs.discordoo.xyz/base-guide/starting/)

## Planned features
* **Waifoo** — a framework for creating discord bots based on Discordoo (commands, other features).
* **Kawaioo** — a library / nestjs microservice that will allow you to interact with the Discordoo ShardingManager over TCP and UDP, to create your own scalable REST API for the bot.
* **Voice support** — at this moment, the library does not support voice.
* **Microservices** — injection of microservices into the Client that can communicate with each other.

## Contributing
Feel free to create a PR, but check if there is an existing one.
See [Contributing Guide](https://github.com/Discordoo/discordoo/blob/master/CONTRIBUTING.md).
