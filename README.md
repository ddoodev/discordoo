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
<a href="https://docs.discordoo.xyz">API Docs</a>
<span> · </span>
<a href="https://guide.discordoo.xyz">Guide</a>
<span> · </span>
<a href="https://github.com/Discordoo/discordoo/blob/master/CONTRIBUTING.md">Contribute</a>
</p> 


<hr>

## WARNING
Most of the stuff described here is not done yet, and we are just planning to implement it

## About
Discordoo is a Discord API library interface. It was built from ground-up to provide better APIs, both internal and external.

In general, Discordoo was designed to be completely modular. Each thing, such as Gateway provider or
cache storage can be replaced with anything you have written/installed from npm.

Moreover, we designed Discordoo to be simple to use. For example, you don't need to use non-sense
like `broadcastEval` to get info from another shard. You always work with cache like you normally
would when using a collection. Even more, Discordoo abstracts you from hard things without limiting you to simple APIs. 

In addition, Discordoo also can be used in different ways. If you don't need Gateway, 
why use it? Use nothing but `RESTClient` - the thing you actually need.

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

## Contributing
Feel free to create a PR, but check if there is an existing one.
See [Contributing Guide](https://github.com/Discordoo/discordoo/blob/master/CONTRIBUTING.md).
