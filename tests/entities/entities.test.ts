import { Message as RawMessage, EntitiesUtil } from '@src/api/entities'

describe('Entities', () => {

  test('must contain entities by default', () => {
    const Message = EntitiesUtil.get('Message')

    expect(
      Message.prototype === RawMessage.prototype
    )
  })

  test('must extend entities without extender function', () => {
    class ExtendedMessage extends RawMessage {
      __test__(): void {
        return void 100500
      }
    }

    expect(
      EntitiesUtil.extend('Message', ExtendedMessage).prototype === ExtendedMessage.prototype
    )
    expect(
      EntitiesUtil.get('Message').prototype === ExtendedMessage.prototype
    )
  })

  test('must reset entity to default', () => {
    expect(
      EntitiesUtil.get('Message').prototype !== RawMessage.prototype
    )

    expect(
      EntitiesUtil.clear('Message').prototype === RawMessage.prototype
    )

    expect(
      EntitiesUtil.get('Message').prototype === RawMessage.prototype
    )
  })

  test('must extend entities with extender function', () => {
    let extended

    expect(
      EntitiesUtil.extend('Message', Message => {
        class ExtendedMessage extends Message {
          __test__(): void {
            return void 100500
          }
        }

        extended = ExtendedMessage
        return ExtendedMessage
      }).prototype === extended.prototype
    )

    expect(
      EntitiesUtil.get('Message').prototype === extended.prototype
    )
  })

})
