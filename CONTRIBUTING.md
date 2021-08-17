# Discordoo Contribution guide
Hello and first thanks for your interest in contributing to Discordoo! Discordoo hasn't grown up yet, however we have some plans to develop it into a stable and production-ready library.
Further, in this document we'll describe all the aspects of contributing to Discordoo.

## General
Please, follow [our code of conduct](CODE_OF_CONDUCT.md). Try your best to treat others as you would wish to be treated yourself.

## Version control
### Commit-style
Discordoo uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) for its commits.
You should also use Present Simple for commits (which wasn't followed during base development). You should write sentences so 
that they show what do the code changes contain. E.g. ~~This commit does~~ add export to some important interfaces.  

### Branching
Discordoo uses three types of branches: features, master and release.
* Features(`feat-feature-name-in-kebab-case`) branches are the branches which include any major changes to the library itself.
* Develop(`develop`) branch is the main branch. It is the current version which is being developed and usually unstable.
* Release(`release-v1.5.3`) branches are the branches that are forked from master branch each library release. Changes in them are not allowed.

## Code
### Documentation
Discordoo uses `typedoc` package for documentation generation. Each method or class have to be documented as precise as possible.
### Style
We use `eslint` package for code style enforcement.
