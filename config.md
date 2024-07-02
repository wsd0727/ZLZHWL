TMS 新版本




## 1.页面配置

|字段名|标注|数据类型|备注|
|---|---|---|----|
| id | 主键 | String ||
| type | 类别 | add edit detail 
| template  | 模板  | String  | list-列表，form-表单，tlist-树列表 | 
| button |按钮栏配置|Array| |
| query  | 筛选配置 | Array |   |
| form | 表单|Object | 主表单字段集 | { colType:1, labelCol:8,valueCol:16,columns:[] }

| table |  { url:'接口地址',detailPath:'详情的路由地址' ,columns:['表格列的配置']   }

| multiple  |   |   | 0-单选(默认)，1-多选  |  
| primary | 主表配置|Array |   |
| sub | 子表配置|Array-Array | |
| subShowType  | 子表展示类型|String | tab-多页签,scroll-左右拖动 |
| tree | 树结构配置 |   |   

## 1.页面中按钮配置
|字段名| 标注 |备注|
|---|---|---|---|
| Id  | ID  | 主键  | 
| Title | 按钮名称 | 必填 |
| Disabled | 高亮（是否可点击）  | 0-常亮（默认），1-条件亮，2-选中亮  |
| Condition | 高亮条件 | disabled=1时必填 | 
| type  | 操作类型 表格内的必填， 1-打开页面（新增），2-必须选中一条数据去提交且刷新列表-提交后刷新页面（删除，作废，停用），  | 3重置表单 | 4 选中一条数据且打开新页面 （编辑）
| Url | 提交接口 | type=0 或者 type=4 必填 |
| UrlParams | 提交的参数 | 0-全部，['billno']-数据中的字段 |
| PagePath | 打开页面的  | type=2，必填 |
| Config | 打开新页面或窗口的配置 | type=1,必填  |


###  动态配置说明

列表中按钮的配置
按钮类型的说明：
|字段|值|描述|
| type  | 1  | 打开页面 |
| type  | 2  | 打开弹窗 |
| type  | 3  | 提交数据 |
| type  | 4  | 重置 |
| type  | 5  | 查询 |
| type  | 6  | 筛选 |


###  查询控件的级联关系配置  依然是在 other 

URL？固定查询条件参数？依赖主表字段条件参数？赋值条件？清空下级数据

发货单位：/select/getSelectTypeList?type=9??sendComId=dictValue?sendlinkPsn&sendlinkTel&sendAreaCd&sendAddr

发货地址：/select/getSelectTypeList?type=8?customerId=sendComId$请选择围栏类型?sendlinkPsn=param1&sendlinkTel=param2&sendAreaCd=param3
??a=type$请选择围栏类型?laglog=citycode    [112.6545, 34.25]


## /dynamic/component/getSelectTypeList?type=17??pkCustomer=dictValue&customerName=dictLabel&customerCode=code

## URL？固定查询条件参数？依赖主表字段条件参数？赋值条件？清空下级数据

###  列表的首行点击打开详情配置

通过在按钮配置里面的动作：det   即可实现



###  表格配置说明

列表中按钮的配置
按钮类型的说明：
| 字段          |值  |       描述    |
| align        | 1  |       对齐方式 |
| controls     | 3  | 控件类型，启用编辑时有效 |
| editTable    | 4  | 是否可编辑 |
| field         | 5  |  主键  |
| label         | 6    |  名称  |
| orderNo       | 5    |  排序  |
| other        | 6    |   其它配置 |
| resizable     | 5    |    |
| selectedFlag  | 6    |    |
| slot          |      |        |
| slotcfg|      |       |       |
| sortable|     |       |       |
| title|        |       |       |
| type|         |       |       |
| width|        | 
| suffix        |       |       |
| filterMultiple|       |       |
| filters|||


###  suffix 后缀配置说明  携带@符号标识是变量  否则是常量 ，多个使用| 分割
配置常量单个拼接 eg: suffix:'元'  
配置常量多个拼接 eg: suffix:'元|KG'
配置变量单个拼接 eg: suffix:'@unit'
配置常量+变量拼接 eg: suffix:'@unit|元|斤'


### 动态配置控制，其它配置的属性以及表单值 
```
{
    "0":{
        "CF":{
            "startBidTime":{
                "isShow":1
            }
        },
        "FORM":{
            "vmemo":12
        }
    },
    "1":{
        "CF":{
            "startBidTime":{
                "isShow":0
            }
        }
    }
}
```


component/getSysTemTable   查询数据库表列表   参数 keyword
component/getSysTableColumn  根据库表id查询表字段列表   参数 billNo


### 计算 单价*数量=总价   ，主表总价=子表总价的和 
### 计算类型+-*/ ？使用的计算的字段  ？赋值条件，必须子表在前主表在后，S(子表)]$字段 M(主表)$需要给主表赋值的字段&主表赋值时需要取的子表的字段值汇总  ，
*?$qty$price?S$totalAmt&M$totalAmt


selectedFlag

###  调用地图时的配置 需要知道围栏类型，如果存在就去验证，不存在的时候
#### regionName 区域名称 regionCode 区域编码 radius 半径  points坐标（字符串数组） fenceType 围栏类型
regionName=provinceName&regionCode=provinceName&radius=radius&points=addrLong&fenceType=type



###  新增模板注意事项 
1. 要在 sysytem/comfig/add-menu-form  的componentOptions添加模板名称，大驼峰写法 
2. 要在 sysytem/comfig/config.js 的slotCFG  写入 
3. 要在 router/async/router.map.js 中引入该新增的模板


### 日期控件的校验配置
1. 在日期控件的其它配置（other） 里面配置变量：,  也可以写 数字， +5表示5天后可选， -5表示今天的前5天开始可选，today和0表示当天开始

```
{
    "maxVar": "",
    "minVar": "xxDay",
    "msg": "请先选择结婚日期"
}

```
###  区域配置  province=AA&provinceCode=BB&city=CC&cityCode=DD&region=EE&regionCode=FF  废弃



###  身份证读卡配

```
{
    "Address":"adr",
    "Birthday":"",
    "Department":"",
    "EndDate":"",
    "ICCard":"",
    "IDCode":"idCard",
    "IDKxh":"601021235",
    "Name":"name",
    "Nation":"",
    "Sex":"",
    "StartDate":""
}

```




## 表单配置字段详解

```
 {
    "billNo": "主键",
    "pkBillNo": "父主键",
    "sortCode": "排序",
    "position": "位置",
    "id": "以前的字段",
    "title": "label名称",
    "field": "字段",
    "label": "label名称",
    "controls": "控件类型",
    "other": "其它自定义配置",
    "options": "下拉配置（已废弃）",
    "groupid": "是否常用",
    "type": "已作废",
    "queryType": "已作废",
    "startFieldName": "开始信息(只在配置查询有用)",
    "endFieldName": "结束信息(只在配置查询有用)",
    "groupCode": "分组编码",
    "totalType": "已作废",
    "isQuerySord": "已作废",
    "sortable": "已作废",
    "isRequire": "是否必填",
    "isShow": "是否显示（0=否，1=是，2=表达式）",
    "disabled": "是否禁用",
    "rules": "校验规则",
    "rulesReg": "自定义校验时的正则表达式",
    "rulesRegErr": "自定义校验时校验失败后的提示",
    "col": "单行总列表24",
    "fieldType": "已作废",
    "maxLength": "已作废",
    "point": "已作废",
    "defaultVal": "默认值",
    "labelColor":"已作废",
    "valueColor": "已作废",
    "fontWeight": "已作废",
    "suffix": "后缀",
    "width": "已作废",
    "align": "对齐方式",
    "resizable": "已作废",
    "slot": "插槽",
    "slotCfg": "插槽配置",
    "fixed": "是否固定列",
    "filters": "是否启用过滤查询",
    "filterMultiple": "",
    "createTime": "创建时间",
    "editTable": "是否可编辑",
    "selectedFlag": "1",
    "isAes": "是否排序",
    "isOnly": "是否唯一",
    "isExcel": "是否导入",
    "isRever": "是否映射",
    "reverField": null,
    "vdef1": null,
    "vdef2": null,
    "vdef3": null,
    "vdef4": null,
    "vdef5": null,
    "vdef6": null,
    "vdef7": null,
    "vdef8": null,
    "vdef9": null,
    "vdef10": null,
    "scrnCondition": "按钮的禁用条件"
}
```

======================================================
## Form 组件

## 新版本 级联配置的控制，主要控制显示、必填和清空下级数据
* 在级联里面配置json 对象 、ISSHOW 的显示条件 ISREQUIRE 必填的控制条件 CLEAN 需要清空的字段集合
```
{"ISSHOW":"Data.ISPURORG==1","ISREQUIRE":"Data.ISPURORG==1","CLEAN":"OUTERPHONE,MANAGER"}
```

### 级联组件 数据
* 配置 表单值=数据Key,多个&相连
```javascript
{
  data:"110000,110100,110101",
  dataName: "北京市,市辖区,东城区",
  province: "110000",
  provinceName: "北京市",
  city: "110100",
  cityName: "市辖区",
  county: "110101",
  countyName: "东城区",
}
```

### 地图组件 数据
* 配置 表单值=数据Key,多个&相连
```javascript
{
  type: "",
  path: [],
  radius: 0,
  address: ""
}
``` 

### 当前登陆人数据
* U$[字段]  // 例如 U$BILLNO
* 限制 只读，下拉查询，分组选择，多项选择，
```javascript
{
    // 集团
    ORGNAME:"",
    PK_ORG:"",
    // 组织
    GROUOPNAME:"",
    PK_GROUP:"",
    // 部门
    DEPTNAME:"",
    PK_DEPT:"",
    // 个人
    USERNAME:"",
    BILLNO:"",
}
```


###  other 新配置方案
```
{
    "url":"接口地址",
    "params":"固定条件{TYPE:1}",
    "relyOn":"依赖条件{PK_ORG:'ORGID'}",
    "linkage":"联动关系",
    "setvalue":"赋值条件{PK_ORG:'VALUE',A:'LABEL'}",
    "clear":"A,B,C",
    "calc":"计算条件"
}
```

### 输入框 的值同步给其它参数  在其它配置里面配置 ：代表SHORTNAME 取 VNAME
```
{"setvalue":{"SHORTNAME":"VNAME"}}
```



### 按钮配置，针对打卡弹窗/页面 中的按钮如果配置了按钮，全部走配置的自定义按钮，否则只有保存按钮

按钮中在禁用条件栏目配置 PAGEACTION 是指在哪种页面下可以显示， 比如按钮只在编辑页面显示，那么配置：PAGEACTION=='EDIT' 


### 表格配置枚举超链接时，需要选择类型为 枚举超链接，其次需要配置映射字段为超链接要打开的按钮的id


### 表格单元格的拼接 配置说明  label名称  value值的字段 
```
 [
    {
    "label": "项目",
    "value": "VNAME",
    "row": "0"
    },
    {
    "label": "金额",
    "value": "CTMNY",
    "row": "1"
    },
    {
    "label": "客户",
    "value": "CUSTNAME",
    "row": "1"
    }
]
```

### 左侧树和弹窗的表单值进行关联  配置默认值时加 TREE| 标识
默认值配置：TREE|YBILLNO=VALUE&VNAME=LABEL   参考合同新增  


### 文件  下载和预览，通过对按钮的其它配置新增属性进行控制权限问题  案例参照合同附件
#### FILEID （文件id） = 取值于选中数据的某个字段 ， PK_PARENT_MENU_ID（上级菜单id）= 固定参数 （可不传） PROJECTID（项目id）= 取值于选中数据某个字段值
```
{"FILEID":"VDDEF1","PK_PARENT_MENU_ID":"MU230302950844","PROJECTID":"VBILLCODE"}
```


### 配置树形表格 在单据设计里面进行维护树结构

```
{"transform":"1","rowField":"BILLNO","parentField":"PK_PARENT","treenodeId":"VNAME"}
```


### 手机端 倒计时控件
```
{
"type": "[{\"id\":\"0\",\"name\":\"抢单\",\"color\":\"orange\"},{\"id\":\"1\",\"name\":\"竞价\",\"color\":\"blue\"}]",
"typeID": "BILLSTATUS",
"timeID": "UNEFFECTTIME",
"price": "NNUM",
"unit": "元/吨"
}
```

### 手机端 起止点控件

```
{"startPoint":"起点字段","endPoint":"终点字段","startDate":"装货时间","endDate":"卸货时间","distance":"距离字段"}
```

### 手机端 列表中的子表控件
```
{
"progressBar": "进度条字段",
"list": "[{\"id\":\"物料名称字段\",\"label\":\"物料名称\"},{\"id\":\"字段\",\"label\":\"名称\"}]"
}

```


### 手机端 列表中的顶部单号+状态  id 主键字段  ， statusID 状态字段(对应字典枚举字段)   bTypeID 单据类型字段 
```
{
"id": "BILLNO", 
"statusID": "SIGNTYPE",
"bTypeID"
}

```

### 表单资质控件
```
{
    "isSwitch":"1 开启资质",
    "explain":"右上角资质说明",
    "list":"[{\"id\":\"行驶证字段\",\"label\":\"行驶证\",\"isOCR\":\"1开启OCR\",\"require\":\"1开启必填\",\"bgImg\":\"\",\"accpt\":\"1\"},{\"id\":\"CARSPICURL\",\"label\":\"车头照片\",\"isOCR\":\"\",\"require\":\"\",\"bgImg\":\"\",\"accpt\":\"1\"}]"
}
```

###  拨打电话控件  
```

```


### 选择车辆回填

```
{
"menuid":"MU230818564616",
 "pageid":"PG230818797784",
"setvalue":'{"CARNO":"VNAME","PK_CAR":"BILLNO","ENTRUSTNUM":"CARSGSW "}'
}
```

### 手机竞价列表 宫格布局  ExGrid
```
[{"id":"MILEAGE","name":"运价","color":"red","unit":"元/吨"},{"id":"MILEAGE","name":"保证金","color":"red","unit":"元"},{"id":"MILEAGE","name":"出价幅度","color":"red","unit":"元"}]
```

### 手机竞价列表 报量，报价 ExNumber 需要配置后缀  , 提交按钮配置到其它里面
```
{
"btnName": "竞价提交",
"url": "/oms/app/bidRecord/confirmSubmit",
"rules": "EXPECTVALUE,BIDPRICE"
}
```


### 手机抢单 需要配置的抢单量  btnType 0 是提交数据， 1是赋值逻辑   rules如果是提交的类型
```
{
    "btnName": "全量抢单",
    "btnType": "1",
    "valueBy": "ENTRUSTNUM",
    "url": "",
    "rules": "ROBORDERNUM"
}
```

### 运输规则，节点选择控件，在其它配置需配置
```

```




