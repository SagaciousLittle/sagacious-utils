# 常用工具类
## API
### ObjectUtils
#### 操作对象工具类

**1. init(target: Object) 初始化工具类**

**2. val() 获取处理后的值**

**3. removeEmpty() 去除对象中的非零不规范数据**
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
