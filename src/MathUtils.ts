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
