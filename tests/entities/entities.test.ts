import { Attachment, Attachment as RawAttachment, Entities } from '@src/entities'

describe('Entities', () => {

  test('must contain entities by default', () => {
    const Attachment = Entities.get('Attachment')

    expect(
      Attachment.prototype === RawAttachment.prototype
    )
  })

  test('must extend entities without extender function', () => {
    class ExtendedAttachment extends RawAttachment {
      __test__(): void {
        return void 100500
      }
    }

    expect(
      Entities.extend('Attachment', ExtendedAttachment).prototype === ExtendedAttachment.prototype
    )
    expect(
      Entities.get('Attachment').prototype === ExtendedAttachment.prototype
    )
  })

  test('must reset entity to default', () => {
    expect(
      Entities.get('Attachment').prototype !== Attachment.prototype
    )

    expect(
      Entities.clear('Attachment').prototype === Attachment.prototype
    )

    expect(
      Entities.get('Attachment').prototype === Attachment.prototype
    )
  })

  test('must extend entities with extender function', () => {
    let extended

    expect(
      Entities.extend('Attachment', Attachment => {
        class ExtendedAttachment extends Attachment {
          __test__(): void {
            return void 100500
          }
        }

        extended = ExtendedAttachment
        return ExtendedAttachment
      }).prototype === extended.prototype
    )

    expect(
      Entities.get('Attachment').prototype === extended.prototype
    )
  })

})
