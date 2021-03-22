import getDateFromSnowflake from '../../src/util/getDateFromSnowflake'

test('getDateFromSnowflake', () => {
  expect(
    getDateFromSnowflake('419524085736013834').getTime()
  ).toBe(new Date(1520092736420).getTime())
})