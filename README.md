![ddoologo_v1 5](https://user-images.githubusercontent.com/44965055/113192570-98562000-9267-11eb-966f-ea562bbb1f85.png)
<div style="text-align: center;">
<b>Discord bots. Simplified and boosted 🚀</b>
</div>

<div style="text-align: center">
  <a href="https://discord.gg/TFZtXeYVM5">
    <img 
      src="https://img.shields.io/discord/811663819721539674?color=purple&label=Discord&style=for-the-badge" 
      alt="Online"
    >
  </a>
</div> 

<div style="text-align: center">
<a href="https://discordoo.xyz/api">API Docs</a>
<span> · </span>
<a href="https://discordoo.xyz/guide">Guide</a>
<span> · </span>
<a href="https://github.com/Discordoo/discordoo/blob/master/CONTRIBUTING.md">Contribute</a>
</div> 


<hr>

## WARNING
Most of the stuff described here is not done yet, and we are just planning to implement it

## About
**[Discordoo](https://discordoo.xyz)** is a **modular and powerful** node.js library to interact with the Discord API.
It is designed to be scalable, fast and customizable.
It provides a set of tools, like easy-to-use project generator, official framework(see `@discordoo/commander`).

## Open-source and free
Discordoo is completely free and open-source! It is licensed under MIT license, so you can use it as long as you want to 
and how you want to.

## Getting started

### Creating a project
The recommended way to use Discordoo is to use official project generator - 
```shell
$ mkdir mybot
$ cd mybot
$ npm init @discordoo 
```
Answer simple questions, and it will have the project scaffolded for you. Simple, isn't it?

Wanna see more? Go [here](https://discordoo.xyz/guide/getting-started) to explore all of Discordoo!

### Packages
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
