# 地图组件 解释
# 文档
js2.0 https://lbs.amap.com/api/jsapi-v2/summary/
类 https://lbs.amap.com/api/jsapi-v2/documentation#marker

## 1. Key (必须)
## 2. props (组件通信数据)
| 字段   | 名称     | 必须                  | 默认值                     |
|--------|----------|-----------------------|----------------------------|
| type   | 类型     | 是                    |                            |
| zoom   | 缩放级别 | 否                    | 15                         |
| center | 中心点   | 否                    | [121.5273285, 31.25515044] |
| path   | 路径     | 折线,多边形,矩形 必填 | []                         |
| radius | 半径     | 圆型 必填             | 1000(米)                   |
### 1） type (类型)