[discordoo](../README.md) / [core](../modules/core.md) / RequestBuilder

# Interface: RequestBuilder

[core](../modules/core.md).RequestBuilder

## Table of contents

### Methods

- [auditLogs](core.requestbuilder.md#auditlogs)
- [bans](core.requestbuilder.md#bans)
- [bulkDelete](core.requestbuilder.md#bulkdelete)
- [channels](core.requestbuilder.md#channels)
- [connections](core.requestbuilder.md#connections)
- [crosspost](core.requestbuilder.md#crosspost)
- [delete](core.requestbuilder.md#delete)
- [emojis](core.requestbuilder.md#emojis)
- [followers](core.requestbuilder.md#followers)
- [gateway](core.requestbuilder.md#gateway)
- [get](core.requestbuilder.md#get)
- [github](core.requestbuilder.md#github)
- [guilds](core.requestbuilder.md#guilds)
- [integrations](core.requestbuilder.md#integrations)
- [invites](core.requestbuilder.md#invites)
- [members](core.requestbuilder.md#members)
- [messages](core.requestbuilder.md#messages)
- [nick](core.requestbuilder.md#nick)
- [patch](core.requestbuilder.md#patch)
- [permissions](core.requestbuilder.md#permissions)
- [pins](core.requestbuilder.md#pins)
- [post](core.requestbuilder.md#post)
- [preview](core.requestbuilder.md#preview)
- [prune](core.requestbuilder.md#prune)
- [put](core.requestbuilder.md#put)
- [reactions](core.requestbuilder.md#reactions)
- [recipients](core.requestbuilder.md#recipients)
- [regions](core.requestbuilder.md#regions)
- [roles](core.requestbuilder.md#roles)
- [slack](core.requestbuilder.md#slack)
- [sync](core.requestbuilder.md#sync)
- [templates](core.requestbuilder.md#templates)
- [typing](core.requestbuilder.md#typing)
- [users](core.requestbuilder.md#users)
- [v](core.requestbuilder.md#v)
- [vanityUrl](core.requestbuilder.md#vanityurl)
- [voice](core.requestbuilder.md#voice)
- [webhooks](core.requestbuilder.md#webhooks)
- [widget](core.requestbuilder.md#widget)
- [widgetJson](core.requestbuilder.md#widgetjson)
- [widgetPng](core.requestbuilder.md#widgetpng)

## Methods

### auditLogs

▸ **auditLogs**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:5](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L5)

___

### bans

▸ **bans**(`id?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:22](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L22)

___

### bulkDelete

▸ **bulkDelete**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:10](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L10)

___

### channels

▸ **channels**(`id?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:6](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L6)

___

### connections

▸ **connections**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:33](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L33)

___

### crosspost

▸ **crosspost**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:8](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L8)

___

### delete

▸ **delete**(`options`: [*RequestOptions*](core.requestoptions.md)): *Record*<string, any\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*RequestOptions*](core.requestoptions.md) |

**Returns:** *Record*<string, any\>

Defined in: [src/core/modules/rest/RequestBuilder.ts:43](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L43)

___

### emojis

▸ **emojis**(`id?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:17](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L17)

___

### followers

▸ **followers**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:15](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L15)

___

### gateway

▸ **gateway**(`bot`: *boolean*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`bot` | *boolean* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:38](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L38)

___

### get

▸ **get**(`options`: [*RequestOptions*](core.requestoptions.md)): *Record*<string, any\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*RequestOptions*](core.requestoptions.md) |

**Returns:** *Record*<string, any\>

Defined in: [src/core/modules/rest/RequestBuilder.ts:39](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L39)

___

### github

▸ **github**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:37](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L37)

___

### guilds

▸ **guilds**(`id?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:4](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L4)

___

### integrations

▸ **integrations**(`id?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:25](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L25)

___

### invites

▸ **invites**(`code`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`code` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:12](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L12)

___

### members

▸ **members**(`id?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:19](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L19)

___

### messages

▸ **messages**(`id?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:7](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L7)

___

### nick

▸ **nick**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:20](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L20)

___

### patch

▸ **patch**(`options`: [*RequestOptions*](core.requestoptions.md)): *Record*<string, any\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*RequestOptions*](core.requestoptions.md) |

**Returns:** *Record*<string, any\>

Defined in: [src/core/modules/rest/RequestBuilder.ts:42](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L42)

___

### permissions

▸ **permissions**(`id`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:11](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L11)

___

### pins

▸ **pins**(`id?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:13](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L13)

___

### post

▸ **post**(`options`: [*RequestOptions*](core.requestoptions.md)): *Record*<string, any\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*RequestOptions*](core.requestoptions.md) |

**Returns:** *Record*<string, any\>

Defined in: [src/core/modules/rest/RequestBuilder.ts:40](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L40)

___

### preview

▸ **preview**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:18](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L18)

___

### prune

▸ **prune**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:23](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L23)

___

### put

▸ **put**(`options`: [*RequestOptions*](core.requestoptions.md)): *Record*<string, any\>

#### Parameters:

Name | Type |
:------ | :------ |
`options` | [*RequestOptions*](core.requestoptions.md) |

**Returns:** *Record*<string, any\>

Defined in: [src/core/modules/rest/RequestBuilder.ts:41](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L41)

___

### reactions

▸ **reactions**(`emoji?`: *string*, `user?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`emoji?` | *string* |
`user?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:9](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L9)

___

### recipients

▸ **recipients**(`id`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:16](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L16)

___

### regions

▸ **regions**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:24](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L24)

___

### roles

▸ **roles**(`id?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:21](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L21)

___

### slack

▸ **slack**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:36](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L36)

___

### sync

▸ **sync**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:26](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L26)

___

### templates

▸ **templates**(`code?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`code?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:31](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L31)

___

### typing

▸ **typing**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:14](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L14)

___

### users

▸ **users**(`id`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:32](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L32)

___

### v

▸ **v**(`version`: *6* \| *8*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`version` | *6* \| *8* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:44](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L44)

___

### vanityUrl

▸ **vanityUrl**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:30](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L30)

___

### voice

▸ **voice**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:34](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L34)

___

### webhooks

▸ **webhooks**(`id?`: *string*, `token?`: *string*): [*RequestBuilder*](core.requestbuilder.md)

#### Parameters:

Name | Type |
:------ | :------ |
`id?` | *string* |
`token?` | *string* |

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:35](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L35)

___

### widget

▸ **widget**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:27](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L27)

___

### widgetJson

▸ **widgetJson**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:28](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L28)

___

### widgetPng

▸ **widgetPng**(): [*RequestBuilder*](core.requestbuilder.md)

**Returns:** [*RequestBuilder*](core.requestbuilder.md)

Defined in: [src/core/modules/rest/RequestBuilder.ts:29](https://github.com/Discordoo/discordoo/blob/11a6501/src/core/modules/rest/RequestBuilder.ts#L29)
