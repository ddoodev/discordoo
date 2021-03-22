import Base from '../../src/core/structures/Base'

describe('Base', () => {
  test('createdAt', () => {
    const abc = new Base('419524085736013834')
    expect(abc.createdAt.getTime()).toBe(new Date(1520092736420).getTime())
  })
})