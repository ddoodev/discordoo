# Discordoo Contribution guide
Hello and first of all thanks for your interest in contributing to Discordoo! Discordoo hasn't grown up yet, however we have some plans to develop it into stable and production-ready library.
Further in this document we'll describe all the aspects of contributing to Discordoo.

## General
Please, follow [our code of conduct](CODE_OF_CONDUCT.md). You'll be treated the same way you treat others.

## Version control
### Commit-style
Discordoo uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) for its commits. However, we have only accept some of types:
* feat - new features
* fix - bug fixes
* perf - performance tweaks
* org - repository organization things
* ref - refactoring
* docs - documentation changes
* ver - a new version release
* ci - GitHub actions changes

### Branching
Discordoo uses three types of branches: features, master and release. 
* Features(`feat-feature-name-in-kebab-case`) branches are branches which include any changes to library itself.
* Master(`master`) branch in the main branch. It is the current version being developed and is usually unstable.
* Release(`release-v1.5.3`) branches are branches that are forked from master branch each library release. Changes in them are not allowed.

## Code
### Documentation
Discordoo uses `typedoc` package for documentation generation. Each method or class have to be documentated as precise as possible
### Style
We use `eslint` package for code style enforcment. It is automatically runned on each commit.
