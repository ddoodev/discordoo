import idToDate from '../../src/utils/idToDate'

test('idToDate', () => {
  expect(
    idToDate('419524085736013834').getTime()
  ).toBe(new Date(1520092736420).getTime())
})
