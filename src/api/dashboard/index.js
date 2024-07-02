import request from "@/utils/request";



// 查询角色下的仪表
export function getCardIDByRole() {
  return request({
    url: "/work/panel/config",
    method: "post",
    data: {},
  });
}

// 查询卡片类型
export function getCardType(data) {
  return request({
    url: "/cardDialogConf/getCardTree/v2",
    method: "post",
    data: {
      KEYWORD: "",
      BILLNO: "",
    },
  });
}

// 查询卡片数据
export function getCardList(data) {
  return request({
    url: "cardDialogConf/getCardList",
    method: "post",
    data,
  });
}

// 新增 和编辑 仪表列表
export function addDashboard(data) {
  let url  = data.BILLNO ? '/panelAndCardConfig/panel/update': '/panelAndCardConfig/panel/add' ;
  return request({
    url: url ,
    method: "post",
    data,
  });
}

// 删除仪表列表
export function deleteDashboard(data) {
  return request({
    url: "/panelAndCardConfig/panel/delete",
    method: "post",
    data,
  });
}

// 获取仪表列表
export function getDashboard(data) {
  return request({
    url: "/cardDialogConf/getPanelList",
    method: "post",
    data,
  });
}

// 单个卡片和仪表进行关联 ，保存配置
export function saveCard2Dashboard(data) {
  return request({
    url: "/panelAndCardConfig/saveAndUpdConfigInfoSimple",
    method: "post",
    data,
  });
}

// 获取仪表下的所有卡片配置
export function getCard2Dashboard(data) {
  return request({
    url: "/panelAndCardConfig/getConfigCardsByPanelNo",
    method: "post",
    data,
  });
}


// 获取仪表下的查询条件
export function getCardQueryCFG(data) {
  return request({
    url: "/paneldefine/getPanelDefine",
    method: "post",
    data,
  });
}

// 获取指定仪表下的卡片详情
export function getCardDetail(data) {
  return request({
    url: "/panelAndCardConfig/getConfigDetail",
    method: "post",
    data,
  });
}

// 删除仪表下的某个卡片
export function deletCard2Dashboard(data){
  return request({
    url: "/panelAndCardConfig/delConfigInfoBatch",
    method: "post",
    data,
  });
}

// 批量保存所有的卡配置到仪表下
export function saveAllCard2Dashboard(data){
  return request({
    url: "/panelAndCardConfig/saveAndUpdConfigInfoBatch",
    method: "post",
    data,
  });
}

// 获取项目列表

export function getProjectData(data){
  return request({
    url: '/workclockpunch/getUserWorkClockPunchProjs',
    method: "post",
    data,
  });
  
}


// 公共的卡片数据查询接口
export function getVchartData(url,data){
  return request({
    url: url,
    method: "post",
    data,
  });
}

export const cardConfig = [
  {
    COL: "6",
    CONTROLS: "ExTextBox",
    FIELD: "VNAME",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "标题",
    OTHER: "/sys/module/getTreeList???PK_PARENT=VALUE",
    RULES: "",
    REVERFIELD:"PARENTNAME",
  },
  {
    COL: "6",
    CONTROLS: "ExTextBox",
    FIELD: "DATA_INTERFACE_URL",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "接口地址",
    OTHER: "",
    RULES: "",
    REVERFIELD:"",
  },
  {
    COL: "6",
    CONTROLS: "ExTextBox",
    FIELD: "EXEC_DQL",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "执行SQL",
    OTHER: "",
    RULES: "",
    REVERFIELD:"",
  },
  {
    COL: "6",
    CONTROLS: "ExTextBox",
    FIELD: "HREF_URL",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "超链接",
    OTHER: "",
    RULES: "",
    REVERFIELD:"",
  },
  {
    COL: "6",
    CONTROLS: "ExSwitch",
    FIELD: "IS_REFRESH",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "刷新",
    OTHER: "",
    RULES: "",
    REVERFIELD:"",
    DEFAULTVAL: "1"
  },
  // {
  //   COL: "6",
  //   CONTROLS: "ExTextBox",
  //   FIELD: "页面",
  //   ISSHOW: "1",
  //   ISREQUIRE: "1",
  //   LABEL: "执行SQL",
  //   OTHER: "",
  //   RULES: "",
  //   REVERFIELD:"",
  // },
  
]


export const dashboardConfig = [
  {
    COL: "20",
    CONTROLS: "ExTextBox",
    FIELD: "PANEL_NAME",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "标题",
    OTHER: "",
    RULES: "",
    REVERFIELD:"PARENTNAME",
  },
  {
    COL: "20",
    CONTROLS: "ExTextBox",
    FIELD: "VMEMO",
    ISSHOW: "1",
    ISREQUIRE: "",
    LABEL: "备注",
    OTHER: "",
    RULES: "",
    REVERFIELD:"PARENTNAME",
  }
]