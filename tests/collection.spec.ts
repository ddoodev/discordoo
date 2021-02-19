import { Collection } from '../packages/collection'

describe('Collection', () => {
  test('clone', () => {
    const testCol = new Collection<string, number>()
    testCol.set('abc', 5)
    testCol.set('abcd', 6)
    expect(testCol.equal(testCol.clone())).toBe(true)
  })

  test('equal', () => {
    const testCol = new Collection<string, any>()
    const testCol2 = new Collection<string, any>()
    testCol.set('5', 10)
    testCol2.set('5', 10)

    expect(testCol.equal(testCol2)).toBe(true)

    testCol2.set('5', 345)
    expect(testCol.equal(testCol2)).toBe(false)
  })

  test('filter', () => {
    const testCol = new Collection<string, any>(
      [ [ 'test', 5 ], [ 'test3', 10 ], [ 'test4', 2 ], [ 'test5', 1 ] ]
    )
    expect(
      testCol.filter(i => i >= 5).equal(new Collection<string, any>([ [ 'test', 5 ], [ 'test3', 10 ] ]))
    ).toBe(true)
  })
})
