import moment from 'moment'
import _ from 'lodash'

export default class TimePeriodUtils {

  private target: Period

  constructor (target: Period = []) {
    this.target = target.sort((a, b) => a.date.valueOf() - b.date.valueOf())
  }
  
  /**
   * 整合数据
   *
   * @param {Period} [period=[]]
   * @returns
   * @memberof TimePeriodUtils
   */
  integrate (period: Period = []) {
    const {
      target,
    } = this
    const _startTime = target[0].date
    const _endTime = target[target.length - 1].date
    period = period.filter(o => {
      let _o = o.date.valueOf()
      return _o >= _startTime.valueOf() && _o <= _endTime.valueOf()
    })
    if (period.length === 0 || target.length === 0) return this
    this.target = _.cloneDeep(period).reduce((res, o) => {
      const _o = o.date.valueOf()
      if (_o < res[0].date.valueOf() || _o > res[res.length - 1].date.valueOf()) return res
      if (res.length === 1) return [o]
      for (let i = 0; i < res.length - 1; i++) {
        if (_o < res[i + 1].date.valueOf()) {
          res[i] = o
          break
        }
      }
      return res
    }, _.cloneDeep(this.target))
    return this
  }

  /**
   * 获取值
   *
   * @returns
   * @memberof TimePeriodUtils
   */
  val () {
    return this.target
  }

  static _moment = moment

  /**
   * 获取原生处理工具
   *
   * @static
   * @returns
   * @memberof TimePeriodUtils
   */
  static getNative () {
    return this._moment
  }

  /**
   * 获取时间段
   *
   * @static
   * @param {CompleOptions} {
   *     endTime = new Date(),
   *     startTime,
   *     stretch = 1,
   *     stretchUnit = 'h',
   *     stretchDirection = 'before',
   *     interval = 1,
   *     intervalUnit = 'm',
   *     fillValue = null,
   *   }
   * @returns {TimePeriodUtils}
   * @memberof TimePeriodUtils
   */
  static complePeriod ({
    endTime = new Date(),
    startTime,
    stretch = 1,
    stretchUnit = 'h',
    stretchDirection = 'before',
    interval = 1,
    intervalUnit = 'm',
    fillValue = null,
  }: CompleOptions = {}): TimePeriodUtils {
    // endTime与startTime取整
    const rounding = (date: Date) => moment(moment(date).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').toDate()
    endTime = rounding(endTime)
    if (startTime) startTime = rounding(startTime)
    const operate = stretchDirection === 'before' ? 'subtract' : 'add'
    if (startTime) startTime = moment(startTime).toDate()
    else startTime = moment(endTime)[operate](stretch, stretchUnit).toDate()
    if (startTime.valueOf() > endTime.valueOf()) [startTime, endTime] = [endTime, startTime]
    const res: Period = [{
      date: endTime,
      value: fillValue,
    }]
    while (res[0].date.valueOf() > startTime.valueOf()) {
      res.unshift({
        date: moment(res[0].date)[operate](interval, intervalUnit).toDate(),
        value: fillValue,
      })
    }
    return new this(res)
  }
}

type Period = {
  date: Date
  value: any
  [others: string]: any
}[]

/**
 * 时间段配置项
 *
 * @interface CompleOptions
 */
interface CompleOptions {

  /**
   * 结束时间，默认取当前时间
   *
   * @type {Date}
   * @memberof CompleOptions
   * @default new Date()
   */
  endTime?: Date

  /**
   * 开始时间
   *
   * @type {Date}
   * @memberof CompleOptions
   */
  startTime?: Date

  /**
   * 伸展距离，startTime为空时有效，默认为1
   *
   * @type {number}
   * @memberof CompleOptions
   * @default 1
   */
  stretch?: number
  
  /**
   * 伸展距离单位，startTime为空时有效，默认为h
   *
   * @type {('h' | 'd' | 'm')}
   * @memberof CompleOptions
   */
  stretchUnit?: 'h' | 'd' | 'm'

  /**
   * 伸展方向，startTime为空时有效，默认向前
   *
   * @type {('before' | 'after')}
   * @memberof CompleOptions
   * @default 'before'
   */
  stretchDirection?: 'before' | 'after'

  /**
   * 间隔，默认为1
   *
   * @type {number}
   * @memberof CompleOptions
   * @default 1
   */
  interval?: number
  
  /**
   * 间隔单位，默认为m
   *
   * @type {('d' | 'm')}
   * @memberof CompleOptions
   * @default 'm'
   */
  intervalUnit?: 'd' | 'm'

  /**
   * 填充值
   *
   * @type {*}
   * @memberof CompleOptions
   * @default null
   */
  fillValue?: any
}
