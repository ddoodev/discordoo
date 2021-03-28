[discordoo](../README.md) / [core](../modules/core.md) / RestModule

# Interface: RestModule

[core](../modules/core.md).RestModule

Represents a rest module

## Hierarchy

* [*Module*](core.module.md)

* *TypedEmitter*<[*RestModuleEvents*](core.restmoduleevents.md)\>

  ↳ **RestModule**

## Table of contents

### Properties

- [destroyed](core.restmodule.md#destroyed)
- [id](core.restmodule.md#id)
- [init](core.restmodule.md#init)
- [initialized](core.restmodule.md#initialized)

### Methods

- [addListener](core.restmodule.md#addlistener)
- [emit](core.restmodule.md#emit)
- [eventNames](core.restmodule.md#eventnames)
- [getMaxListeners](core.restmodule.md#getmaxlisteners)
- [listenerCount](core.restmodule.md#listenercount)
- [listeners](core.restmodule.md#listeners)
- [off](core.restmodule.md#off)
- [on](core.restmodule.md#on)
- [once](core.restmodule.md#once)
- [prependListener](core.restmodule.md#prependlistener)
- [prependOnceListener](core.restmodule.md#prependoncelistener)
- [rawListeners](core.restmodule.md#rawlisteners)
- [removeAllListeners](core.restmodule.md#removealllisteners)
- [removeListener](core.restmodule.md#removelistener)
- [request](core.restmodule.md#request)
- [setMaxListeners](core.restmodule.md#setmaxlisteners)

## Properties

### destroyed

• `Optional` **destroyed**: () => *void* \| *Promise*<void\>

Function, which will be emitted once module is destroyed

#### Type declaration:

▸ (): *void* \| *Promise*<void\>

**Returns:** *void* \| *Promise*<void\>

Defined in: [src/core/modules/Module.ts:21](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/Module.ts#L21)

Inherited from: [Module](core.module.md).[destroyed](core.module.md#destroyed)

Defined in: [src/core/modules/Module.ts:21](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/Module.ts#L21)

___

### id

• **id**: *string* \| *symbol*

Unique id for this module.

Inherited from: [Module](core.module.md).[id](core.module.md#id)

Defined in: [src/core/modules/Module.ts:25](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/Module.ts#L25)

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

Defined in: [src/core/modules/Module.ts:17](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/Module.ts#L17)

Inherited from: [Module](core.module.md).[init](core.module.md#init)

Defined in: [src/core/modules/Module.ts:17](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/Module.ts#L17)

___

### initialized

• **initialized**: *boolean*

Whether the module was initialized

Inherited from: [Module](core.module.md).[initialized](core.module.md#initialized)

Defined in: [src/core/modules/Module.ts:12](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/Module.ts#L12)

## Methods

### addListener

▸ **addListener**<U\>(`event`: U, `listener`: [*RestModuleEvents*](core.restmoduleevents.md)[U]): [*RestModule*](core.restmodule.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*RestModuleEvents*](core.restmoduleevents.md)[U] |

**Returns:** [*RestModule*](core.restmodule.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:11

___

### emit

▸ **emit**<U\>(`event`: U, ...`args`: *Parameters*<[*RestModuleEvents*](core.restmoduleevents.md)[U]\>): *boolean*

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`...args` | *Parameters*<[*RestModuleEvents*](core.restmoduleevents.md)[U]\> |

**Returns:** *boolean*

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:19

___

### eventNames

▸ **eventNames**<U\>(): U[]

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

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

▸ **listenerCount**(`type`: *request*): *number*

#### Parameters:

Name | Type |
:------ | :------ |
`type` | *request* |

**Returns:** *number*

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:21

___

### listeners

▸ **listeners**<U\>(`type`: U): [*RestModuleEvents*](core.restmoduleevents.md)[U][]

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

#### Parameters:

Name | Type |
:------ | :------ |
`type` | U |

**Returns:** [*RestModuleEvents*](core.restmoduleevents.md)[U][]

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:22

___

### off

▸ **off**<U\>(`event`: U, `listener`: [*RestModuleEvents*](core.restmoduleevents.md)[U]): [*RestModule*](core.restmodule.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*RestModuleEvents*](core.restmoduleevents.md)[U] |

**Returns:** [*RestModule*](core.restmodule.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:18

___

### on

▸ **on**<U\>(`event`: U, `listener`: [*RestModuleEvents*](core.restmoduleevents.md)[U]): [*RestModule*](core.restmodule.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*RestModuleEvents*](core.restmoduleevents.md)[U] |

**Returns:** [*RestModule*](core.restmodule.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:17

___

### once

▸ **once**<U\>(`event`: U, `listener`: [*RestModuleEvents*](core.restmoduleevents.md)[U]): [*RestModule*](core.restmodule.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*RestModuleEvents*](core.restmoduleevents.md)[U] |

**Returns:** [*RestModule*](core.restmodule.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:16

___

### prependListener

▸ **prependListener**<U\>(`event`: U, `listener`: [*RestModuleEvents*](core.restmoduleevents.md)[U]): [*RestModule*](core.restmodule.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*RestModuleEvents*](core.restmoduleevents.md)[U] |

**Returns:** [*RestModule*](core.restmodule.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:12

___

### prependOnceListener

▸ **prependOnceListener**<U\>(`event`: U, `listener`: [*RestModuleEvents*](core.restmoduleevents.md)[U]): [*RestModule*](core.restmodule.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*RestModuleEvents*](core.restmoduleevents.md)[U] |

**Returns:** [*RestModule*](core.restmodule.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:13

___

### rawListeners

▸ **rawListeners**<U\>(`type`: U): [*RestModuleEvents*](core.restmoduleevents.md)[U][]

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

#### Parameters:

Name | Type |
:------ | :------ |
`type` | U |

**Returns:** [*RestModuleEvents*](core.restmoduleevents.md)[U][]

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:23

___

### removeAllListeners

▸ **removeAllListeners**(`event?`: *request*): [*RestModule*](core.restmodule.md)

#### Parameters:

Name | Type |
:------ | :------ |
`event?` | *request* |

**Returns:** [*RestModule*](core.restmodule.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:15

___

### removeListener

▸ **removeListener**<U\>(`event`: U, `listener`: [*RestModuleEvents*](core.restmoduleevents.md)[U]): [*RestModule*](core.restmodule.md)

#### Type parameters:

Name | Type |
:------ | :------ |
`U` | *request* |

#### Parameters:

Name | Type |
:------ | :------ |
`event` | U |
`listener` | [*RestModuleEvents*](core.restmoduleevents.md)[U] |

**Returns:** [*RestModule*](core.restmodule.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:14

___

### request

▸ **request**(): [*RequestBuilder*](core.requestbuilder.md)

Create a new request

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RestModule.ts:13](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RestModule.ts#L13)

___

### setMaxListeners

▸ **setMaxListeners**(`n`: *number*): [*RestModule*](core.restmodule.md)

#### Parameters:

Name | Type |
:------ | :------ |
`n` | *number* |

**Returns:** [*RestModule*](core.restmodule.md)

Inherited from: void

Defined in: node_modules/tiny-typed-emitter/lib/index.d.ts:25
