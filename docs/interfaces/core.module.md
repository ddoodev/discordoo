[discordoo](../README.md) / [core](../modules/core.md) / Module

# Interface: Module

[core](../modules/core.md).Module

Represents a module

Not meant to be used by regular users, just for library's and third-party developers

## Table of contents

### Properties

- [destroyed](core.module.md#destroyed)
- [id](core.module.md#id)
- [init](core.module.md#init)
- [initialized](core.module.md#initialized)

## Properties

### destroyed

• `Optional` **destroyed**: () => *void* \| *Promise*<void\>

Function, which will be emitted once module is destroyed

#### Type declaration:

▸ (): *void* \| *Promise*<void\>

**Returns:** *void* \| *Promise*<void\>

Defined in: [src/core/modules/Module.ts:21](https://github.com/Discordoo/discordoo/blob/e040d45/src/core/modules/Module.ts#L21)

Defined in: [src/core/modules/Module.ts:21](https://github.com/Discordoo/discordoo/blob/e040d45/src/core/modules/Module.ts#L21)

___

### id

• **id**: *string* \| *symbol*

Unique id for this module.

Defined in: [src/core/modules/Module.ts:25](https://github.com/Discordoo/discordoo/blob/e040d45/src/core/modules/Module.ts#L25)

___

### init

• `Optional` **init**: (`client`: [*Client*](../classes/core.client.md)) => *void* \| *Promise*<void\>

Function, which will be emitted once module was initialized on client's startup

**`param`** 

#### Type declaration:

▸ (`client`: [*Client*](../classes/core.client.md)): *void* \| *Promise*<void\>

#### Parameters:

Name | Type |
:------ | :------ |
`client` | [*Client*](../classes/core.client.md) |

**Returns:** *void* \| *Promise*<void\>

Defined in: [src/core/modules/Module.ts:17](https://github.com/Discordoo/discordoo/blob/e040d45/src/core/modules/Module.ts#L17)

Defined in: [src/core/modules/Module.ts:17](https://github.com/Discordoo/discordoo/blob/e040d45/src/core/modules/Module.ts#L17)

___

### initialized

• **initialized**: *boolean*

Whether the module was initialized

Defined in: [src/core/modules/Module.ts:12](https://github.com/Discordoo/discordoo/blob/e040d45/src/core/modules/Module.ts#L12)
