// 控件
export const CONTROLS = [
  { LABEL: "读取", VALUE: "ExReadCard" },
  { LABEL: "输入框", VALUE: "ExTextBox" },
  { LABEL: "密码", VALUE: "ExPassword" },
  { LABEL: "文本域", VALUE: "ExTextarea" },
  { LABEL: "数字输入框", VALUE: "ExNumber" },
  { LABEL: "字典", VALUE: "ExSelect" },
  { LABEL: "字典多选", VALUE: "ExSelectMultiple" },
  { LABEL: "查询", VALUE: "ExSelectSearch" },
  { LABEL: "查询多选", VALUE: "ExSelectMutiple" },
  { LABEL: "树选择", VALUE: "ExSelectGroup" },
  { LABEL: "级联选择", VALUE: "ExRegion" },
  { LABEL: "时间", VALUE: "ExTime" },
  { LABEL: "日期", VALUE: "ExDate" },
  { LABEL: "日期区间", VALUE: "ExDateRange" },
  { LABEL: "日期时间", VALUE: "ExDateTime" },
  { LABEL: "日期时间区间", VALUE: "ExDateTimeRange" },
  { LABEL: "单选框", VALUE: "ExRadio" },
  { LABEL: "单选按钮", VALUE: "ExRadioButton" },
  { LABEL: "多选", VALUE: "ExCheckbox" },
  { LABEL: "省市区", VALUE: "ExArea" },
  { LABEL: "开关", VALUE: "ExSwitch" },
  { LABEL: "车牌号", VALUE: "ExCarNum" },
  { LABEL: "图片上传", VALUE: "ExUpload" },
  { LABEL: "拍照", VALUE: "ExPhoto" },
  { LABEL: "文件上传", VALUE: "ExUploadFile" },
  { LABEL: "图片预览", VALUE: "ExShowImage" },
  { LABEL: "富文本", VALUE: "ExEditor" },
  { LABEL: "JSON预览", VALUE: "ExJsonViewer" },
  { LABEL: "地图地址", VALUE: "ExMap" },
  { LABEL: "子表", VALUE: "subTable" },  // 子表 组件集
  { LABEL: "页签", VALUE: "ExTabs" },
  { LABEL: "下拉表格", VALUE: "ExSelectTable" },
  { LABEL: "下拉表格弹窗", VALUE: "ExSelectModal" },
  { LABEL: "表格弹窗", VALUE: "ExModalTable" },
  { LABEL: "图标", VALUE: "ExModalIcon" },
  { LABEL: "浮动组件", VALUE: "FLOATCOM" }, // 表单右侧 组件集
  { LABEL: "审批流程", VALUE: "WorkFlowTimeLine" },
  { LABEL: "资质/手机", VALUE: "ExAptitude" },
  { LABEL: "顶部页签/手机", VALUE: "ExTopTabs" },
  { LABEL: "步进器/手机", VALUE: "ExNumberBox" },
  { LABEL: "视频/手机", VALUE: "ExVideo" },
  { LABEL: "评分", VALUE: "grade" },
  { LABEL: "节点", VALUE: "ExSteps" },
  { LABEL: "预警标题", VALUE: "ExWarning" },
  { LABEL: "超链接", VALUE: "link" },
  { LABEL: "省市区可单选/手机", VALUE: "ExAreaSub" },
  { LABEL: "穿梭树", VALUE: "TransferTree" },
  { LABEL: "验证码", VALUE: "SmsCode" },
  { LABEL: "权限树多选", VALUE: "ExTreeSelect" },
]

// Table 控件
export const TableCONTROLS = [
  { LABEL: "读取", VALUE: "ExReadCard" },
  { LABEL: "输入框", VALUE: "ExTextBox" },
  { LABEL: "密码", VALUE: "ExPassword" },
  { LABEL: "数字输入框", VALUE: "ExNumber" },
  { LABEL: "下拉选择", VALUE: "ExSelect" },
  { LABEL: "下拉多选", VALUE: "ExSelectMultiple" },
  { LABEL: "查询", VALUE: "ExSelectSearch" },
  { LABEL: "查询多选", VALUE: "ExSelectMutiple" },
  { LABEL: "树选择", VALUE: "ExSelectGroup" },
  { LABEL: "级联选择", VALUE: "ExRegion" },
  { LABEL: "省市区", VALUE: "ExArea" },
  { LABEL: "时间", VALUE: "ExTime" },
  { LABEL: "日期", VALUE: "ExDate" },
  { LABEL: "日期区间", VALUE: "ExDateRange" },
  { LABEL: "日期时间", VALUE: "ExDateTime" },
  { LABEL: "日期时间区间", VALUE: "ExDateTimeRange" },
  { LABEL: "开关", VALUE: "ExSwitch" },
  // { LABEL: "车牌号", VALUE: "ExCarNum" },
  { LABEL: "下拉表格", VALUE: "ExSelectTable" },
  { LABEL: "下拉表格弹窗", VALUE: "ExSelectModal" },
  { LABEL: "表格弹窗", VALUE: "ExModalTable" },
  { LABEL: "文件上传", VALUE: "ExUploadFile" },
  { LABEL: "步进器/手机", VALUE: "ExNumberBox" },
  { LABEL: "文本域/手机", VALUE: "ExTextarea" },
]

// 查询表单 控件
export const QueryCONTROLS = [
  { LABEL: "输入框", VALUE: "ExTextBox" },
  { LABEL: "字典", VALUE: "ExSelect" },
  { LABEL: "下拉查询", VALUE: "ExSelectSearch" },
  { LABEL: "树选择", VALUE: "ExSelectGroup" },
  { LABEL: "日期", VALUE: "ExDate" },
  { LABEL: "日期区间", VALUE: "ExDateRange" },
  { LABEL: "日期时间", VALUE: "ExDateTime" },
  { LABEL: "日期时间区间", VALUE: "ExDateTimeRange" },
  { LABEL: "单选", VALUE: "ExRadio" },
  { LABEL: "级联选择", VALUE: "ExRegion" },
  { LABEL: "开关", VALUE: "ExSwitch" },
]

// 查询类型
export const QUERYTYPE = [
  { LABEL: "IsNull-为空", VALUE: "IsNull" },
  { LABEL: "IsNotNull-不为空", VALUE: "IsNotNull" },
  { LABEL: "EqualTo-等于", VALUE: "EqualTo" },
  { LABEL: "NotEqualTo-不等于", VALUE: "NotEqualTo" },
  { LABEL: "GreaterThan-大于", VALUE: "GreaterThan" },
  { LABEL: "GreaterThanOrEqualTo-大于等于", VALUE: "GreaterThanOrEqualTo", },
  { LABEL: "LessThan-小于", VALUE: "LessThan" },
  { LABEL: "LessThanOrEqualTo-小于等于", VALUE: "LessThanOrEqualTo" },
  { LABEL: "Like-模糊匹配", VALUE: "Like" },
  { LABEL: "NotLike-模糊不匹配", VALUE: "NotLike" },
  { LABEL: "In-包含", VALUE: "In" },
  { LABEL: "NotIn-不包含", VALUE: "NotIn" },
  { LABEL: "Between-在**之间", VALUE: "Between" },
  { LABEL: "NotBetween-不**在之间", VALUE: "NotBetween" },
  { LABEL: "LeftLike-左匹配", VALUE: "LeftLike" },
  { LABEL: "RightLike-右匹配", VALUE: "RightLike" },
  { LABEL: "FUZZYRET-复杂检索", VALUE: "FUZZYRET" },
]

// 位置
export const ALIGN = [
  { LABEL: "居左", VALUE: "left" },
  { LABEL: "居中", VALUE: "center" },
  { LABEL: "居右", VALUE: "right" },
]

// 加密
export const ENCRY = [
  // { LABEL: "MD5加密", VALUE: "4" },
  { LABEL: "无", VALUE: "-" },
  { LABEL: "加密", VALUE: "1" },
  { LABEL: "解密", VALUE: "2" },
  { LABEL: "解密且脱敏", VALUE: "3" },
  { LABEL: "脱敏", VALUE: "4" },
  { LABEL: "加密且脱敏", VALUE: "5" },
]

// 验证规则
export const RULES = [
  { LABEL: "空", VALUE: " " },
  { LABEL: "自定义", VALUE: "Reg" },
  { LABEL: "车牌号", VALUE: "CarNo" },
  { LABEL: "手机号", VALUE: "Mobile" },
  { LABEL: "身份证", VALUE: "IdCard" },
  { LABEL: "密码", VALUE: "PWD" },
  { LABEL: "中文", VALUE: "Chines" },
  { LABEL: "整数", VALUE: "Integer" },
  { LABEL: "数字", VALUE: "NumberFloat" },
  { LABEL: "邮箱", VALUE: "Email" },
  { LABEL: "银行卡", VALUE: "bankCard" },
  { LABEL: "营业执照", VALUE: "businessNo" },
  { LABEL: "字符集", VALUE: "letterSymbol" },
  // { LABEL: "经度", VALUE: "longitude" },
  // { LABEL: "纬度", VALUE: "latitude" },
  { LABEL: "规则密码", VALUE: "regex" },
  // { LABEL: "发动机号", VALUE: "engineNo" },
  // { LABEL: "车辆识别代码", VALUE: "vin" },
  { LABEL: "税率", VALUE: "TaxRate" },
  { LABEL: "后端校验", VALUE: "ApiRules" },
]

// 列表属性
export const VTYPE = [
  { LABEL: "文本", VALUE: "0" },
  { LABEL: "序号", VALUE: "seq" },
  { LABEL: "多选", VALUE: "checkbox" },
  { LABEL: "单选", VALUE: "radio" },
  { LABEL: "展开", VALUE: "expand" },
  { LABEL: "拖拽", VALUE: "drag" },
  { LABEL: "枚举", VALUE: "exNum" },
  { LABEL: "枚举图标", VALUE: "ExSelectIcon" },
  { LABEL: "数字/千分号", VALUE: "ExNumberTh" },
  { LABEL: "图片", VALUE: "ExImg" },
  { LABEL: "拼接", VALUE: "ExJoint" },
  { LABEL: "富文本", VALUE: "ExEditor" },

  { LABEL: "超链接", VALUE: "link" },
  { LABEL: "枚举超链接", VALUE: "exNumLink" },
  { LABEL: "进度条", VALUE: "progressBar" },
  { LABEL: "运输进度", VALUE: "transporSchedule" },
  { LABEL: "评分", VALUE: "grade" },
  { LABEL: "倒计时/手机", VALUE: "ExCountdown" },
  { LABEL: "起止点/手机", VALUE: "ExStartPoint" },
  { LABEL: "子表/手机", VALUE: "ExSubtable" },
  { LABEL: "单号/手机", VALUE: "ExOrder" },
  { LABEL: "资质/手机", VALUE: "ExAptitude" },
  { LABEL: "电话/手机", VALUE: "ExPhone" },
  { LABEL: "宫格/手机", VALUE: "ExGrid" },
  { LABEL: "视频/手机", VALUE: "ExVideo" },
  { LABEL: "数字录入/手机", VALUE: "ExNumber" },
  { LABEL: "常规数字输入框/手机", VALUE: "ExTextBox" },



]

// 定位
export const FIXED = [
  { LABEL: "不冻结", VALUE: "" },
  { LABEL: "固定左侧", VALUE: "left" },
  { LABEL: "固定右侧", VALUE: "right" },
]

// 插槽
export const SLOT = [
  { LABEL: "不启用", VALUE: "-" },
  { LABEL: "开关", VALUE: "switch" },
  { LABEL: "标签", VALUE: "tags" },
  { LABEL: "主表", VALUE: "mainTable" },
  { LABEL: "子表", VALUE: "subTable" },
  { LABEL: "行色", VALUE: "rowBg" },
  { LABEL: "单元格色", VALUE: "cellBg" },
  { LABEL: "展开表格", VALUE: "expandTB" },
  { LABEL: "展开表单", VALUE: "expandFM" },
  { LABEL: "状态节点", VALUE: "statusNode" },
  { LABEL: "列色", VALUE: "EosColBg" },

]

// 
export const TOTAL = [
  { LABEL: "空", VALUE: "-" }, //空
  { LABEL: "sum-求和", VALUE: "sum" }, //求和
  { LABEL: "avg-平均值", VALUE: "avg" }, //求平均值
]


// 按钮的事件类型
export const BtnEventOptions = [
  { LABEL: "打开页面", VALUE: "1" },
  { LABEL: "打开菜单", VALUE: "16" },
  { LABEL: "打开抽屉", VALUE: "27" },
  { LABEL: "表单弹窗", VALUE: "2" },
  { LABEL: "表格弹窗", VALUE: "7" },
  { LABEL: "提交数据", VALUE: "3" },
  { LABEL: "重置", VALUE: "4" },
  { LABEL: "查询", VALUE: "5" },
  { LABEL: "筛选", VALUE: "6" },
  { LABEL: "物流弹窗", VALUE: "8" },
  { LABEL: "查看竞价", VALUE: "9" },
  { LABEL: "承运商指派", VALUE: "10" },
  { LABEL: "直接指派", VALUE: "11" },
  { LABEL: "轨迹回放", VALUE: "12" },
  { LABEL: "导出/文件流", VALUE: "13" },
  { LABEL: "保存并重置", VALUE: "14" },
  { LABEL: "下载/文件路径", VALUE: "15" },
  { LABEL: "模板新增", VALUE: "17" },
  { LABEL: "左树", VALUE: "20" },
  { LABEL: "自定义", VALUE: "21" },
  { LABEL: "批量操作", VALUE: "22" },
  { LABEL: "审批节点", VALUE: "23" },
  { LABEL: "分享", VALUE: "24" },
  { LABEL: "预览", VALUE: "25" },
  { LABEL: "下载/按钮", VALUE: "26" },
  { LABEL: "二维码", VALUE: "28" },
  { LABEL: "溯源", VALUE: "29" },
  { LABEL: "时段预约", VALUE: "30" },

]

// 按钮颜色
export const BtnColors = [
  { LABEL: "主题色", VALUE: "primary" },
  { LABEL: "红色", VALUE: "danger" },
  { LABEL: "绿色", VALUE: "success" },
  { LABEL: "黄色", VALUE: "warning" },
  { LABEL: "灰色", VALUE: "info" },
]

// 按钮依赖
export const BtnChooseType = [
  { LABEL: "不选数据", VALUE: '0' },
  { LABEL: "单选", VALUE: '1' },
  { LABEL: "多选", VALUE: '2' },
]

// 按钮位置
export const BtnPosion = [
  { LABEL: "无", VALUE: '0' },
  { LABEL: "顶部操作", VALUE: '1' },
  { LABEL: "表格操作栏", VALUE: '2' },
]

// 按钮动作类型
export const BtnActionType = [
  { LABEL: "其它", VALUE: "-" },
  { LABEL: "新增", VALUE: "ADD" },
  { LABEL: "编辑", VALUE: "EDIT" },
  { LABEL: "详情", VALUE: "DTL" },
  { LABEL: "其它详情", VALUE: "QTDTL" },
  { LABEL: "步骤表单", VALUE: "STEP" },
  { LABEL: "批量编辑", VALUE: "BATCHEDIT" },
  { LABEL: "计算", VALUE: "CALC" },
  { LABEL: "查询", VALUE: "QRY" },
  { LABEL: "删除", VALUE: "DELETE" },
  { LABEL: "打印", VALUE: "PRINT" },
  { LABEL: "引入", VALUE: "COPYTO" },
  { LABEL: "配载车主", VALUE: "CAROWNER" },
  { LABEL: "配载司机", VALUE: "DRIVERS" },
  { LABEL: "订单配载司机", VALUE: "ORDERDRIVERS" },
  { LABEL: "竞价提交", VALUE: "PRICESUBMIT" },
  { LABEL: "尾差合单", VALUE: "TailDifference" },
  { LABEL: "汽运查看", VALUE: "carCheck" },
  { LABEL: "火运查看", VALUE: "trainCheck" },
  { LABEL: "船运查看", VALUE: "shipCheck" },
  { LABEL: "获取统计", VALUE: "GETCOUNT" },
  { LABEL: "全选提交", VALUE: "ALLSUBMIT" },
  { LABEL: "接口计算", VALUE: "CALCAPI" },




]

// 状态
export const ENABLESTATE = [
  { LABEL: "未启用", VALUE: "0", COLOR: "info" },
  { LABEL: "启用", VALUE: "1", COLOR: "" },
  { LABEL: "停用", VALUE: "2", COLOR: "danger" },
]

// 开关组件 枚举数据
export const SWITCH = [
  { LABEL: "否", VALUE: "0", COLOR: "danger" },
  { LABEL: "是", VALUE: "1", COLOR: "" },
]

export const ISSHOW = [
  { LABEL: "是", VALUE: "1", COLOR: "primary" },
  { LABEL: "否", VALUE: "0", COLOR: "danger" },
  { LABEL: "表达式", VALUE: "2", COLOR: "warning" },
]

// 设备终端 枚举
export const DEVICE = [
  { LABEL: "平台", VALUE: "0" },
  { LABEL: "手机", VALUE: "1" },
  // { LABEL: "手持机", VALUE: "2" },
  { LABEL: "小程序", VALUE: "3" },
]

// 弹窗大小
export const modalSizes = [
  { LABEL: "满屏(100*100)", VALUE: "100%*100%" },
  { LABEL: "大(90*90)", VALUE: "90%*90%" },
  { LABEL: "适中(80*70)", VALUE: "80%*70%" },
  { LABEL: "中(70*60)", VALUE: "70%*60%" },
  { LABEL: "小(60*50)", VALUE: "60%*50%" },
  { LABEL: "中等(50*50)", VALUE: "50%*50%" },
  { LABEL: "迷你(30*30)", VALUE: "30%*30%" },
  { LABEL: "自定义", VALUE: "1" },

]

// 模板类型
export const COMPONENT = [
  { "LABEL": "主模板", "VALUE": "Layout" },
  { "LABEL": "空模板", "VALUE": "ParentView" },
  { "LABEL": "外部链接", "VALUE": "Link" },
  { "LABEL": "新窗口外部链接", "VALUE": "openLink" },
  { "LABEL": "表格页面", "VALUE": "VTable" },
  { "LABEL": "批量表格", "VALUE": "BatchTable" },
  { "LABEL": "Excel表格", "VALUE": "SonTable" },
  { "LABEL": "表单页面", "VALUE": "VForm" },
  { "LABEL": "左树右表", "VALUE": "VTableZtree" },
  { "LABEL": "上下布局(表格)", "VALUE": "VTableSub" },
  { "LABEL": "上下布局(表单)", "VALUE": "VFORMSub" },
  { "LABEL": "仪表盘", "VALUE": "dashboard" },
  { "LABEL": "档案/手机", "VALUE": "Dossier" },
  { "LABEL": "首页/手机", "VALUE": "Home" },
  { "LABEL": "我的/手机", "VALUE": "Mine" },
  { "LABEL": "自定义", "VALUE": "999" }
]