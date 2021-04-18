# Discordoo Contribution guide
Hello and first of all thanks for your interest in contributing to Discordoo! Discordoo hasn't grown up yet, however we have some plans to develop it into stable and production-ready library.
Further, in this document we'll describe all the aspects of contributing to Discordoo.

## General
Please, follow [our code of conduct](CODE_OF_CONDUCT.md). You'll be treated the same way you treat others.

## Version control
### Commit-style
Discordoo uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) for its commits.
You should also use Present Simple for commits(wasn't followed during base development). You should write sentences so 
they show what does the code changes contain. E.g. ~~This commit does~~ add export some important interfaces.  

### Branching
Discordoo uses three types of branches: features, master and release.
* Features(`feat-feature-name-in-kebab-case`) branches are branches which include any major changes to library itself.
* Master(`master`) branch in the main branch. It is the current version being developed and is usually unstable.
* Release(`release-v1.5.3`) branches are branches that are forked from master branch each library release. Changes in them are not allowed.

## Code
### Documentation
Discordoo uses `typedoc` package for documentation generation. Each method or class have to be documentated as precise as possible
### Style
We use `eslint` package for code style enforcement.

## Developer's CLI
We love our contributors! That's the reason, why we've created
Discordoo developer utils. You can access it using
`npm run utils` command. It is pretty straightforward
and easy to use.