import cloneDeep from 'lodash/cloneDeep'

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
export default class ObjectUtils {
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