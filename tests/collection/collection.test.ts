import { Collection } from '@src/collection'

describe('Collection', () => {
  const collection = new Collection()
  collection.set('1', '2').set('3', '4').set('5', '6')

  test('should filter values and return collection', () => {
    expect(
      collection.filter<Collection>(value => value === '4', { return: 'collection' }).size
    ).toBe(1)
  })

  test('should filter values and return array', () => {
    expect(
      collection.filter<Array<any>>(value => value === '4', { return: 'array' }).length
    ).toBe(1)
  })

  test('should filter values and return array without any options', () => {
    expect(
      collection.filter<Array<any>>(value => value === '4' || value === '6' || value === '2').length
    ).toBe(3)
  })
})
