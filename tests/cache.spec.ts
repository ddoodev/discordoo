import { CacheModule, CollectionCacheCell } from '../packages/cache'
import { Collection } from '../packages/collection'

describe('Cache', () => {
  let testModule: CacheModule
  let testingCache: CollectionCacheCell<string, string>

  test('test module creation', () => {
    testModule = new CacheModule
  })

  test('base cache creation', () => {
    testModule.createCache('mySuperCache')
  })

  test('getting cache', () => {
    expect(testModule.getCache('mySuperCache') instanceof CollectionCacheCell).toBe(true)
    testingCache = testModule.getCache<CollectionCacheCell<string, string>>('mySuperCache')!
  })

  describe('CacheCell', () => {
    test('set', async () => {
      await testingCache.set('test', 'test')
    })

    test('get', async () => {
      expect(await testingCache.get('test')).toBe('test')
    })

    test('delete', async () => {
      expect(await testingCache.delete('test')).toBe(true)
      expect(await testingCache.get('test')).toBeFalsy()
    })

    test('has', async () => {
      await testingCache.set('test', 'test')
      expect(await testingCache.has('test')).toBe(true)
    })

    test('filter', async () => {
      await testingCache.set('test2', 'test555')
      await testingCache.set('test3', 'test5755')
      const expected = new Collection<string, string>([['test2', 'test555'], ['test3', 'test5755']])
      expect((await testingCache.filter(e => e.length > 5)).equal(expected)).toBe(true)
    })

    test('size', async () => {
      expect(await testingCache.size()).toBe(3)
    })

    test('destroy', async () => {
      await testingCache.destroy()
      expect(await testingCache.size()).toBe(0)
    })
  })
})