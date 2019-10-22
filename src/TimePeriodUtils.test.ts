import TimePeriodUtils from './TimePeriodUtils'
import moment from 'moment'

it('complePeriod and integrate', () => {
  const source = [
    {
      date: moment().subtract(6, 'm').toDate(),
      value: 6,
    },
    {
      date: moment().subtract(16, 'm').toDate(),
      value: 16,
    },
    {
      date: moment().add(6, 'm').toDate(),
      value: '+6',
    },
  ]
  expect(TimePeriodUtils.complePeriod().integrate(source).val().reverse()[6].value).toEqual(source[0].value)
})
