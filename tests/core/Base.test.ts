import Base from '../../src/core/structures/Base'

describe('Base', () => {
  test('createdAt', () => {
    const abc = new Base('419524085736013834')
    expect(abc.createdAt.getTime()).toBe(new Date(1520092736420).getTime())
  })

  describe('equal', () => {
    const abc = new Base('419524085736013834')
    const def = new Base('419524085736013834')
    const idk = new Base('405044179182419980')

    test('not equal', () => {
      expect(abc.equal(idk)).toBe(false)
    })

    test('equal', () => {
      expect(abc.equal(def)).toBe(true)
    })
  })
})