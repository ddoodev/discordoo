[discordoo](../README.md) / [core](../modules/core.md) / Client

# Class: Client

[core](../modules/core.md).Client

Entry point for all of Discordoo. Manages modules and events

## Hierarchy

* *TypedEmitter*<[*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)\>

  ↳ **Client**

## Table of contents

### Constructors

- [constructor](core.client.md#constructor)

### Properties

- [modules](core.client.md#modules)
- [defaultMaxListeners](core.client.md#defaultmaxlisteners)

### Methods

- [addListener](core.client.md#addlistener)
- [emit](core.client.md#emit)
- [eventNames](core.client.md#eventnames)
- [getMaxListeners](core.client.md#getmaxlisteners)
- [listenerCount](core.client.md#listenercount)
- [listeners](core.client.md#listeners)
- [m](core.client.md#m)
- [module](core.client.md#module)
- [off](core.client.md#off)
- [on](core.client.md#on)
- [once](core.client.md#once)
- [prependListener](core.client.md#prependlistener)
- [prependOnceListener](core.client.md#prependoncelistener)
- [rawListeners](core.client.md#rawlisteners)
- [removeAllListeners](core.client.md#removealllisteners)
- [removeListener](core.client.md#removelistener)
- [setMaxListeners](core.client.md#setmaxlisteners)
- [use](core.client.md#use)

## Constructors

### constructor

\+ **new Client**(): [*Client*](core.client.md)

**Returns:** [*Client*](core.client.md)

Inherited from: void

## Properties

### modules

• **modules**: [*ModuleManager*](core.modulemanager.md)

Module manager of this client

Defined in: [src/core/Client.ts:13](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/Client.ts#L13)

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: *number*

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:10

## Methods

### addListener

▸ **addListener**<U\>(`event`: U, `listener`: [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U]): [*Client*](core.client.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U] |

**Returns:** [*Client*](core.client.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:11

___

### emit

▸ **emit**<U\>(`event`: U, ...`args`: *Parameters*<[*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U]\>): *boolean*

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`...args` | *Parameters*<[*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U]\> |

**Returns:** *boolean*

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:19

___

### eventNames

▸ **eventNames**<U\>(): U[]

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

**Returns:** U[]

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:20

___

### getMaxListeners

▸ **getMaxListeners**(): *number*

**Returns:** *number*

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:24

___

### listenerCount

▸ **listenerCount**(`type`: *ready*): *number*

#### Parameters:

Name | Type |
:------ | :------ |
`type` | *ready* |

**Returns:** *number*

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:21

___

### listeners

▸ **listeners**<U\>(`type`: U): [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U][]

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

#### Parameters:

Name | Type |
:------ | :------ |
`type` | U |

**Returns:** [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U][]

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:22

___

### m

▸ **m**(`id`: *string* \| *symbol*): *null* \| [*Module*](../interfaces/core.module.md)

Get a module. Alias for module(id).

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | *string* \| *symbol* | module id    |

**Returns:** *null* \| [*Module*](../interfaces/core.module.md)

Defined in: [src/core/Client.ts:20](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/Client.ts#L20)

___

### module

▸ **module**(`id`: *string* \| *symbol*): *null* \| [*Module*](../interfaces/core.module.md)

Get a module

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`id` | *string* \| *symbol* | module id    |

**Returns:** *null* \| [*Module*](../interfaces/core.module.md)

Defined in: [src/core/Client.ts:29](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/Client.ts#L29)

___

### off

▸ **off**<U\>(`event`: U, `listener`: [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U]): [*Client*](core.client.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U] |

**Returns:** [*Client*](core.client.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:18

___

### on

▸ **on**<U\>(`event`: U, `listener`: [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U]): [*Client*](core.client.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U] |

**Returns:** [*Client*](core.client.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:17

___

### once

▸ **once**<U\>(`event`: U, `listener`: [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U]): [*Client*](core.client.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U] |

**Returns:** [*Client*](core.client.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:16

___

### prependListener

▸ **prependListener**<U\>(`event`: U, `listener`: [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U]): [*Client*](core.client.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U] |

**Returns:** [*Client*](core.client.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:12

___

### prependOnceListener

▸ **prependOnceListener**<U\>(`event`: U, `listener`: [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U]): [*Client*](core.client.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U] |

**Returns:** [*Client*](core.client.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:13

___

### rawListeners

▸ **rawListeners**<U\>(`type`: U): [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U][]

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

#### Parameters:

Name | Type |
:------ | :------ |
`type` | U |

**Returns:** [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U][]

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:23

___

### removeAllListeners

▸ **removeAllListeners**(`event?`: *ready*): [*Client*](core.client.md)

#### Parameters:

Name | Type |
:------ | :------ |
`event?` | *ready* |

**Returns:** [*Client*](core.client.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:15

___

### removeListener

▸ **removeListener**<U\>(`event`: U, `listener`: [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U]): [*Client*](core.client.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *ready* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*ClientEventHandlers*](../interfaces/core.clienteventhandlers.md)[U] |

**Returns:** [*Client*](core.client.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:14

___

### setMaxListeners

▸ **setMaxListeners**(`n`: *number*): [*Client*](core.client.md)

#### Parameters:

Name | Type |
:------ | :------ |
`n` | *number* |

**Returns:** [*Client*](core.client.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:25

___

### use

▸ **use**(...`modules`: [*Module*](../interfaces/core.module.md)[]): *void*

Create a new module load group

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`...modules` | [*Module*](../interfaces/core.module.md)[] | modules in the group    |

**Returns:** *void*

Defined in: [src/core/Client.ts:38](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/Client.ts#L38)
