import cloneDeep from 'lodash/cloneDeep'
import {
  create,
  all,
  MathJsStatic,
} from 'mathjs'

/**
 * 数学计算类，提供精确计算
 *
 * @export
 * @class MathUtils
 */
export class MathUtils {
  private math: Partial<MathJsStatic>
  private target?: number
  private static FORMULA_ERROR = new Error(`公式有误`)
  constructor (target?: number) {
    this.math = create(all, {
      number: 'BigNumber',
      precision: 64,
    })
    this.target = target
  }

  /**
   * 初始化目标数据
   *
   * @static
   * @param {number} target
   * @returns
   * @memberof MathUtils
   */
  static init (target?: number | string) {
    const _target = Number(target)
    if (_target === undefined || !Number.isNaN(_target)) return new this(_target)
    return new this().evaluate(target + '')
  }

  /**
   * 执行数学公式
   *
   * @param {string} formula
   * @returns
   * @memberof MathUtils
   */
  evaluate (formula: string) {
    try {
      this.target = Number(this.math.evaluate!(formula))
    } catch (e) {
      // throw MathUtils.FORMULA_ERROR
    }
    return this
  }

  /**
   * 获取目标数据
   *
   * @returns
   * @memberof MathUtils
   */
  val () {
    return this.target
  }
}

type ObjectTarget = {
  [key: string]: any
}

/**
 * 对象操作类去除对象中的非零不规范数据配置
 */
type ObjectUtilsRemoveOptions = {
  /**
   * 处理后的值
   */
  targetVal?: any
  /**
   * 元素为数组的key
   */
  arrayKeys?: string[]
  /**
   * 数组处理后的值
   */
  arrayVal?: any[],
  /**
   * 对象为数组时是否处理，默认为true
   */
  operateArray?: boolean
}

/**
 * 对象操作类
 *
 * @class ObjectUtils
 */
export class ObjectUtils {
  private target: ObjectTarget
  private static TYPE_ERROR = new Error('目标对象类型不为object')

  /**
   * 初始化工具类与目标对象
   *Creates an instance of ObjectUtils.
   * @param {ObjectTarget} target
   * @memberof ObjectUtils
   */
  constructor (target: ObjectTarget) {
    if (typeof target !== 'object') throw ObjectUtils.TYPE_ERROR
    this.target = cloneDeep(target)
  }

  /**
   * 初始化目标对象
   *
   * @static
   * @param {ObjectTarget} target
   * @returns
   * @memberof ObjectUtils
   */
  static init (target: ObjectTarget) {
    return new this(target)
  }

  /**
   * 去除对象中的非零不规范数据
   *
   * @static
   * @param {ObjectTarget} target
   * @param {ObjectUtilsRemoveOptions} [options]
   * @returns
   * @memberof ObjectUtils
   */
  static removeEmpty (target: ObjectTarget, options?: ObjectUtilsRemoveOptions) {
    return ObjectUtils.init(target).removeEmpty(options)
  }

  /**
   * 去除对象中的非零不规范数据
   *
   * @param {ObjectUtilsRemoveOptions} [options={
   *     targetVal: '-',
   *     arrayKeys: [],
   *     arrayVal: [],
   *     operateArray: true,
   *   }]
   * @returns
   * @memberof ObjectUtils
   */
  removeEmpty (options: ObjectUtilsRemoveOptions = {
    targetVal: '-',
    arrayKeys: [],
    arrayVal: [],
    operateArray: true,
  }) {
    const {
      target,
    } = this
    const {
      targetVal,
      arrayKeys,
      arrayVal,
      operateArray,
    } = options
    Object.keys(target).forEach((k: string) => {
      if (typeof target[k] !== 'object' || target[k] === null) {
        if (!target[k] && target[k] !== 0) {
          if (arrayKeys && arrayKeys.indexOf(k) > -1) target[k] = arrayVal
          else if (!(target instanceof Array) || operateArray) target[k] = targetVal
        }
      } else {
        target[k] = ObjectUtils.removeEmpty(target[k]).val()
      }
    })
    return this
  }

  /**
   * 获取目标对象
   *
   * @returns
   * @memberof ObjectUtils
   */
  val () {
    return this.target
  }
}
/**
 * 队列元素
 */
type OrderQueneElement = {
  /**
   * 开始执行回调
   */
  start?: (...args: any[]) => Promise<any>
  /**
   * 结束执行回调
   */
  end?: (...args: any[]) => Promise<any>
  /**
   * 延迟时间
   */
  delay?: number
  /**
   * 最后一个元素延迟时间
   */
  endDelay?: number
}
/**
 * 公共配置
 */
type OrderQueneOptions = {
  /**
   * 延迟时间
   */
  delay?: number
  /**
   * 最后一个元素延迟时间
   */
  endDelay?: number
}

/**
 * 顺序队列
 *
 * @export
 * @class OrderQuene
 */
export class OrderQuene {
  private active?: OrderQueneElement
  private quene: OrderQueneElement[] = []
  private options: OrderQueneOptions = {
    delay: 1000 * 2,
    endDelay: 1000 * 5,
  }
  private clearable?: Promise<void>
  private timer?: number
  private running: boolean = false
  private cacheData: any
  constructor (quene: OrderQueneElement[], options: OrderQueneOptions) {
    if (quene instanceof Array) this.quene = quene
    this.options = {
      ...this.options,
      ...options,
    }
  }

  /**
   * 初始化order quene
   *
   * @static
   * @param {OrderQueneElement[]} quene
   * @param {OrderQueneOptions} [options={}]
   * @returns
   * @memberof OrderQuene
   */
  static init (quene: OrderQueneElement[], options: OrderQueneOptions = {}) {
    return new this(quene, options)
  }

  /**
   * 往队列里添加元素
   *
   * @param {...OrderQueneElement[]} quene
   * @returns
   * @memberof OrderQuene
   */
  push (...quene: OrderQueneElement[]) {
    if (!(quene instanceof Array)) return this
    const len = this.quene.length
    this.quene.push(...quene)
    // 队列最后一个元素执行时，控制时间
    if (len === 0 && this.active && this.clearable) {
      const {
        end,
      } = this.active
      this.clearable.then(async () => {
        clearTimeout(this.timer)
        return Promise.resolve(end && await end())
          .then((data: any) => {
            this.next(data)
          })
      })
    }
    // 队列中没有元素时,根据运行状态开始
    if (len === 0 && !this.active && this.running) this.next(this.cacheData)
    return this
  }

  /**
   * 开始执行队列
   *
   * @param {*} data
   * @memberof OrderQuene
   */
  start (data: any) {
    const {
      running,
    } = this
    this.running = true
    if (!running) this.next(data || this.cacheData)
  }


  /**
   * 停止执行队列，在元素stop回调执行完毕后停止
   *
   * @memberof OrderQuene
   */
  stop () {
    this.running = false
  }

  /**
   * 清空队列
   *
   * @returns 未执行元素
   * @memberof OrderQuene
   */
  clear () {
    const remainingPart = this.quene
    this.quene = []
    return OrderQuene.init(remainingPart)
  }

  /**
   * 继续执行队列
   *
   * @param {*} data
   * @returns
   * @memberof OrderQuene
   */
  private async next (data: any) {
    this.cacheData = data
    if (!this.running) return
    this.active = this.quene.shift()
    if (this.active) {
      const {
        start,
        end,
        delay,
        endDelay,
      } = this.active
      let realDelay = delay || this.options.delay
      if (this.quene.length === 0) {
        this.clearable = new Promise(r => {
          setTimeout(() => {
            r()
          }, realDelay)
        })
        realDelay = endDelay || this.options.endDelay || realDelay
      }
      if (start && start instanceof Function) await start(data)
      return new Promise(r => {
        this.timer = setTimeout(async () => {
          if (end && end instanceof Function) r(await end())
          else r(end)
        }, realDelay)
      })
        .then(data => {
          this.next(data)
        })
    } else {
      if (this.quene.length !== 0) {
        this.next(data)
      }
    }
  }
}

export default {
  ObjectUtils,
  OrderQuene,
}
