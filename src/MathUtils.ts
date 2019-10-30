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
export default class MathUtils {
  private math: Partial<MathJsStatic>
  private target?: number
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
    let target = Number(this.math.evaluate!(formula))
    if (!target || Number.isNaN(target)) throw new Error(`公式有误：${formula}`)
    return this
  }

  /**
   * 设置target
   *
   * @param {number} target
   * @memberof MathUtils
   */
  setTarget (target: number) {
    this.target = target
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
