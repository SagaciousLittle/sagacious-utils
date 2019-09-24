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

export default {
  ObjectUtils,
}
