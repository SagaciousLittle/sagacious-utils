
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
export default class OrderQuene {
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
