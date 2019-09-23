
/**
 * hello world
 *
 * @export
 * @returns {string}
 */
export function helloworld () {
  return 'hello world'
}

/**
 * 对象操作类
 *
 * @class ObjectUtils
 */
class ObjectUtils {
  private target: object

  /**
   * 初始化工具类与目标对象
   *Creates an instance of ObjectUtils.
   * @param {object} target
   * @memberof ObjectUtils
   */
  constructor (target: object) {
    this.target = target
  }

  /**
   * 初始化目标对象
   *
   * @static
   * @param {object} target
   * @returns
   * @memberof ObjectUtils
   */
  static init (target: object) {
    return new this(target)
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

export default {
  ObjectUtils,
}
