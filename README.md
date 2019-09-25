# 常用工具类
## 更新日志
- **2019-09-25 新增OrderQuene类**
- more...

## API
### ObjectUtils
#### 操作对象工具类

**1. init (target: Object) 初始化工具类**

**2. val () 获取处理后的值**

**3. removeEmpty () 去除对象中的非零不规范数据**
```js
type ObjectUtilsRemoveOptions = {
  /**
   * 数组key
   */
  arrayKeys?: string[];
  /**
   * 是否处理数组，默认为true
   */
  operateArray?: boolean;
}
```

**4. static removeEmpty(target) 静态方法 去除对象中的非零不规范数据**

### OrderQuene
#### 顺序队列

**1. init (quene: OrderQueneElement[], options: OrderQueneOptions) 初始化order quene**

**2. push (...quene: OrderQueneElement[]) 往队列里添加元素**

**3. async start (data: any) 开始执行队列**

#### 规则

**延时顺序执行（delay），最后一个元素延时更久执行（endDelay），未执行end回调时有元素推入，1). time < delay，到达delay执行. 2). delay < time < endDelay, 立即执行**

#### 数据类型
```js
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
 * 默认配置
*/
private options: OrderQueneOptions = {
  delay: 1000 * 2,
  endDelay: 1000 * 5,
}
```

#### 案例
```js
// 初始化队列
let x = OrderQuene.init([
  {
    start () {
      console.log('start1')
    },
    end () {
      console.log('end1')
    },
  },
  {
    start () {
      console.log('start2')
    },
    end () {
      console.log('end2')
    },
  },
  {
    start () {
      console.log('start3')
    },
    end () {
      console.log('end3')
    },
  },
])

// 开始执行
x.start()

// 模拟中间插入，等待执行
setTimeout(() => {
  x.push({
    start () {
      console.log('start4')
    },
    end () {
      console.log('end4')
    },
  })
}, 7000)

// 模拟中间插入，立即执行
setTimeout(() => {
  x.push({
    start () {
      console.log('start4')
    },
    end () {
      console.log('end4')
    },
  })
}, 9000)
```