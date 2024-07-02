import { BtnEventOptions, BtnColors, BtnChooseType, BtnActionType, modalSizes ,COMPONENT } from "@/config"

const tableConfig = [

  {
    FIELD: "BILLNO",
    LABEL: "单据编号",
    VTYPE: "",
    WIDTH: "200",
    ALIGN: "center",
    SELECTEDFLAG: 1,
  },
  {
    FIELD: "VCODE",
    LABEL: "模块编码",
    VTYPE: "",
    WIDTH: "150",
    ALIGN: "left",
    SELECTEDFLAG: 1,
  },

  {
    FIELD: "VNAME",
    LABEL: "名称",
    VTYPE: "",
    WIDTH: "150",
    ALIGN: "left",
    SELECTEDFLAG: 1,
    MAXLENGTH: 15,
  },
  {
    FIELD: "PATH",
    LABEL: "路由地址",
    VTYPE: "",
    WIDTH: "150",
    ALIGN: "left",
    SELECTEDFLAG: 1,
  },
  {
    FIELD: "ISMENU",
    LABEL: "功能类型",
    VTYPE: "exNum",
    WIDTH: "150",
    ALIGN: "center",
    SELECTEDFLAG: 1,
    OTHER: '[{"LABEL":"菜单","VALUE":"1"},{"LABEL":"公共","VALUE":"0"}]',
  },

  {
    FIELD: "COMPONENT",
    VTYPE: "exNum",
    WIDTH: "150",
    ALIGN: "center",
    LABEL: "模板类型",
    SELECTEDFLAG: 1,
    OTHER: '[{"LABEL":"主模板","VALUE":"Layout"},{"LABEL":"空模板","VALUE":"ParentView"},{"LABEL":"外部链接","VALUE":"Link"},{"LABEL":"单表格","VALUE":"VTable"},{"LABEL":"批量表格","VALUE":"BatchTable"},{"LABEL":"单表单","VALUE":"VForm"}, {"LABEL":"左树右表","VALUE":"VTableZtree"},{"LABEL":"上下布局(表格)","VALUE":"VTableSub"},{"LABEL":"上下布局(表单)","VALUE":"VFORMSub"},{"LABEL":"仪表盘","VALUE":"dashboard"},{"LABEL":"档案/手机","VALUE":"Dossier"},{"LABEL":"自定义","VALUE":"999"}]',
  },

  {
    FIELD: "SORTCODE",
    LABEL: "排序",
    VTYPE: "",
    WIDTH: "60",
    ALIGN: "center",
    SELECTEDFLAG: 1,
  },


  {
    FIELD: "VURL",
    LABEL: "自定义链接",
    VTYPE: "",
    WIDTH: "200",
    ALIGN: "left",
    SELECTEDFLAG: 1,
  },
];

const menuForm = [
  {
    COL: "12",
    CONTROLS: "ExTextBox",
    FIELD: "VCODE",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "编号",
    OTHER: "",
    point: "",
    RULES: "",
  },
  {
    COL: "12",
    CONTROLS: "ExSelectGroup",
    FIELD: "PK_PARENT",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "上一级",
    OTHER: "/sys/module/getTreeList???PK_PARENT=VALUE",
    RULES: "",
    REVERFIELD:"PARENTNAME",
  },

  {
    COL: "12",
    CONTROLS: "ExTextBox",
    FIELD: "VNAME",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "名称",
    OTHER: "",
    point: "",
    RULES: "",
    MAXLENGTH: 15,
  },
  {
    COL: "6",
    CONTROLS: "ExTextBox",
    FIELD: "VIMG",
    ISSHOW: "1",
    ISREQUIRE: "0",
    LABEL: "图片",
    OTHER: "",
    point: "",
    RULES: "",
  },
  {
    COL: "6",
    CONTROLS: "slot",
    FIELD: "VICON",
    ISSHOW: "1",
    ISREQUIRE: "0",
    LABEL: "图标",
    OTHER: "",
    point: "",
    RULES: "",
  },

  {
    COL: "12",
    CONTROLS: "ExNumber",
    FIELD: "SORTCODE",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "排序",
    OTHER: "",
    point: "",
    RULES: "",
  },
  {
    COL: "12",
    CONTROLS: "ExTextBox",
    FIELD: "PATH",
    isAes: null,
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "路由地址",
    OTHER: "",
    point: "",
    RULES: "",
  },

  {
    COL: "12",
    CONTROLS: "ExSelect",
    FIELD: "TARGET",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "目标",
    options: "",
    OTHER: '[{"LABEL":"需要生成配置","VALUE":"iframe"},{"LABEL":"不需要","VALUE":"blank"}]',
    RULES: "",
    DEFAULTVAL: "blank"
  },



  {
    COL: "12",
    CONTROLS: "ExRadio",
    FIELD: "ISMENU",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "功能类型",
    options: "",
    OTHER: '[{"LABEL":"菜单","VALUE":"1"},{"LABEL":"公共","VALUE":"0"}]',
    RULES: "",
    DEFAULTVAL: "1"
  },


  {
    COL: "4",
    CONTROLS: "ExSwitch",
    FIELD: "ISCACHE",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "允许缓存",
    OTHER: '',
    point: "",
    RULES: "",
    DEFAULTVAL: "1"
  },
  {
    COL: "4",
    CONTROLS: "ExSwitch",
    FIELD: "ISDELETE",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "允许删除",
    OTHER: '',
    point: "",
    RULES: "",
    DEFAULTVAL: "1"
  },
  {
    COL: "4",
    CONTROLS: "ExSwitch",
    FIELD: "ISEDIT",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "允许编辑",
    OTHER: '',
    point: "",
    RULES: "",
    DEFAULTVAL: "1"
  },
  {
    COL: "4",
    CONTROLS: "ExSwitch",
    FIELD: "ENABLESTATE",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "启用",
    OTHER: '',
    RULES: "",
    DEFAULTVAL: "1"
  },
  {
    COL: "6",
    CONTROLS: "ExSwitch",
    FIELD: "ISTEMPLATE",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "关联模板",
    OTHER: '',
    RULES: "",
    DEFAULTVAL: "0"
  },

  {
    COL: "12",
    CONTROLS: "ExSelect",
    FIELD: "COMPONENT",
    isAes: null,
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "模板类型",
    OTHER: JSON.stringify(COMPONENT) ,
    point: "",
    RULES: "",
    DEFAULTVAL: "ParentView"
  },

  {
    COL: "12",
    CONTROLS: "ExTextBox",
    FIELD: "VURL",
    isAes: null,
    ISSHOW: "1",
    ISREQUIRE: "0",
    LABEL: "外链/自定义",
    options: "",
    OTHER: "",
    point: "",
    RULES: "",
  },

  {
    COL: "12",
    CONTROLS: "slot",
    FIELD: "dashboard",
    isAes: null,
    ISSHOW: "1",
    ISREQUIRE: "0",
    LABEL: "仪表盘",
    options: "",
    OTHER: "",
    point: "",
    RULES: "",
  },
  {
    COL: "12",
    CONTROLS: "ExTextBox",
    FIELD: "APPLETURL",
    isAes: null,
    ISSHOW: "1",
    ISREQUIRE: "0",
    LABEL: "小程序自定义",
    options: "",
    OTHER: "",
    point: "",
    RULES: "",
  },

  {
    COL: "12",
    CONTROLS: "ExSelect",
    FIELD: "BILLFROM",
    ISSHOW: "0",
    ISREQUIRE: "1",
    LABEL: "终端",
    options: "",
    OTHER: '[{"LABEL":"平台","VALUE":"0"},{"LABEL":"手机","VALUE":"1"}]',
    RULES: "",
    DEFAULTVAL: "0"
  },

];

const tableBtnConfig = [
  {
    FIELD: "VNAME",
    LABEL: "名称",
    VTYPE: "",
    WIDTH: "",
    ALIGN: "",
    WIDTH: "80",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExTextBox",
  },

  {
    FIELD: "VTYPE",
    LABEL: "类型",
    VTYPE: "",
    WIDTH: "",
    ALIGN: "",
    WIDTH: "100",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExSelect",
    OTHER: JSON.stringify(BtnEventOptions),
    
  },
  {
    FIELD: "COLOR",
    LABEL: "颜色",
    VTYPE: "",
    WIDTH: "",
    ALIGN: "",
    WIDTH: "80",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExSelect",
    OTHER: JSON.stringify(BtnColors),
    DEFAULTVAL: "primary"

  },

  {
    FIELD: "ISCHOOSE",
    LABEL: "依赖类型",
    VTYPE: "",
    WIDTH: "",
    ALIGN: "",
    WIDTH: "100",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExSelect",
    OTHER: JSON.stringify(BtnChooseType),
    DEFAULTVAL: "0"
  },

  {
    FIELD: "ISOFTEN",
    LABEL: "常用",
    VTYPE: "",
    WIDTH: "80",
    ALIGN: "",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExSwitch",
    DEFAULTVAL: "1"
  },
  {
    FIELD: "ISSHOW",
    LABEL: "显示",
    VTYPE: "",
    WIDTH: "80",
    ALIGN: "",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExSwitch",
    DEFAULTVAL: "1"
  },
  {
    FIELD: "RATIO",
    LABEL: "弹窗大小",
    VTYPE: "",
    WIDTH: "130",
    ALIGN: "",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExSelect",
    OTHER: JSON.stringify(modalSizes),
    DEFAULTVAL: "80%*70%"
  },

  {
    FIELD: "SORTCODE",
    LABEL: "排序",
    VTYPE: "",
    WIDTH: "80",
    ALIGN: "",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExTextBox",
  },
  {
    FIELD: "ACTION",
    LABEL: "动作",
    VTYPE: "",
    WIDTH: "100",
    ALIGN: "",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExSelect",
    OTHER: JSON.stringify(BtnActionType)
  },
  {
    FIELD: "SCRNCONDITION",
    LABEL: "禁用条件",
    VTYPE: "",
    WIDTH: "150",
    ALIGN: "",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExTextBox",
  },
  {
    FIELD: "ACTIONADDRESS",
    LABEL: "接口地址",
    VTYPE: "",
    WIDTH: "100",
    ALIGN: "",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExTextBox",
  },
  {
    FIELD: "PK_PAGE",
    LABEL: "操作页面",
    VTYPE: "",
    WIDTH: "120",
    ALIGN: "",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExTextBox",
  },
  {
    FIELD: "PK_PARENT",
    LABEL: "所属页面",
    VTYPE: "",
    WIDTH: "120",
    ALIGN: "",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExTextBox",
  },

  {
    FIELD: "ISTWOSURE",
    LABEL: "二次确认",
    VTYPE: "",
    WIDTH: "100",
    ALIGN: "",
    SELECTEDFLAG: 1,
    EDITTABLE: 1,
    CONTROLS: "ExSwitch",
  },
 
];





export default {
  menuForm,
  tableConfig,
  tableBtnConfig
};
