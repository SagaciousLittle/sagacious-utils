import cloneDeep from 'lodash/cloneDeep'

/**
 * hello world
 *
 * @export
 * @returns {string}
 */
export function helloworld () {
  return 'hello world'
}

type ObjectTarget = {
  [key: string]: any
}

/**
 * 对象操作类去除对象中的非零不规范数据配置
 */
type ObjectUtilsRemoveOptions = {
  /**
   * 数组key
   */
  arrayKeys?: string[]
  /**
   * 是否处理数组，默认为true
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
   *     arrayKeys: [],
   *     operateArray: true,
   *   }]
   * @returns
   * @memberof ObjectUtils
   */
  removeEmpty (options: ObjectUtilsRemoveOptions = {
    arrayKeys: [],
    operateArray: true,
  }) {
    const {
      target,
    } = this
    const {
      arrayKeys,
      operateArray,
    } = options
    Object.keys(target).forEach((k: string) => {
      if (typeof target[k] !== 'object' || target[k] === null) {
        if (!target[k] && target[k] !== 0) {
          if (arrayKeys && arrayKeys.indexOf(k) > -1) target[k] = []
          else if (!(target instanceof Array) || operateArray) target[k] = '-'
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
   * @param {OrderQueneOptions} options
   * @returns
   * @memberof OrderQuene
   */
  static init (quene: OrderQueneElement[], options: OrderQueneOptions) {
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
    if (!(quene instanceof Array)) return
    const len = this.quene.length
    this.quene.push(...quene)
    // 如果队列为空并且active存在，修改时间
    if (len === 0 && this.active && this.clearable) {
      const {
        end,
      } = this.active
      this.clearable.then(async () => {
        clearTimeout(this.timer)
        return Promise.resolve(end && await end())
          .then((data: any) => {
            this.start(data)
          })
      })
    }
    return this
  }

  /**
   * 开始执行队列
   *
   * @param {*} data
   * @returns
   * @memberof OrderQuene
   */
  async start (data: any) {
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
          this.start(data)
        })
    }
  }
}

export default {
  ObjectUtils,
  OrderQuene,
}
