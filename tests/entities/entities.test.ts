import { Guild as RawGuild, EntitiesUtil } from '@src/entities'

describe('Entities', () => {

  test('must contain entities by default', () => {
    const Guild = EntitiesUtil.get('Guild')

    expect(
      Guild.prototype === RawGuild.prototype
    )
  })

  test('must extend entities without extender function', () => {
    class ExtendedGuild extends RawGuild {
      __test__(): void {
        return void 100500
      }
    }

    expect(
      EntitiesUtil.extend('Guild', ExtendedGuild).prototype === ExtendedGuild.prototype
    )
    expect(
      EntitiesUtil.get('Guild').prototype === ExtendedGuild.prototype
    )
  })

  test('must reset entity to default', () => {
    expect(
      EntitiesUtil.get('Guild').prototype !== RawGuild.prototype
    )

    expect(
      EntitiesUtil.clear('Guild').prototype === RawGuild.prototype
    )

    expect(
      EntitiesUtil.get('Guild').prototype === RawGuild.prototype
    )
  })

  test('must extend entities with extender function', () => {
    let extended

    expect(
      EntitiesUtil.extend('Guild', Guild => {
        class ExtendedGuild extends Guild {
          __test__(): void {
            return void 100500
          }
        }

        extended = ExtendedGuild
        return ExtendedGuild
      }).prototype === extended.prototype
    )

    expect(
      EntitiesUtil.get('Guild').prototype === extended.prototype
    )
  })

})
