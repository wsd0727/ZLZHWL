/*
 * 库位图相关配置
 */

export const queryForm = [
  {
    SORTCODE: 6,
    FIELD: "CODE",
    LABEL: "仓库",
    COL: 12,
    CONTROLS: "ExSelectSearch",
    ISREQUIRE: 0,
    ISSHOW: 1,
    OTHER: "/stock/wmBa001/getList???STOCK_NO=STOCK_NO&CODE=VALUE",
    DEFAULTVAL: "",
  },
  {
    COL: 12,
    CONTROLS: "ExReadCard",
    FIELD: "STOCK_NO",
    ISSHOW: "0",
    ISREQUIRE: "1",
    LABEL: "货位号",
    OTHER: "",
    point: "",
    RULES: "",
  },
];

export const detailForm = [
  {
    COL: "12",
    CONTROLS: "ExReadCard",
    FIELD: "RACK_NO",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "货位号",
    OTHER: "",
    point: "",
    RULES: "",
  },
  {
    COL: "12",
    CONTROLS: "ExReadCard",
    FIELD: "STOCK_NAME",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "描述",
    OTHER: "",
    point: "",
    RULES: "",
  },

  {
    COL: "12",
    CONTROLS: "ExReadCard",
    FIELD: "MAX_LAYER",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "数量",
    OTHER: "",
    point: "",
    RULES: "",
  },
  {
    COL: "12",
    CONTROLS: "ExReadCard",
    FIELD: "MAX_HEIGHT",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "重量",
    OTHER: "",
    point: "",
    RULES: "",
  },
  {
    COL: "12",
    CONTROLS: "ExReadCard",
    FIELD: "MAX_HEIGHT",
    ISSHOW: "1",
    ISREQUIRE: "1",
    LABEL: "承重量",
    OTHER: "",
    point: "",
    RULES: "",
  },
];

export const tableConfig = [
  {
    FIELD: "STOCK_NAME",
    LABEL: "品名",
    VTYPE: "",
    WIDTH: "200",
    ALIGN: "center",
    SELECTEDFLAG: 1,
  },
  {
    FIELD: "STOCK_NO",
    LABEL: "规格",
    VTYPE: "",
    WIDTH: "200",
    ALIGN: "center",
    SELECTEDFLAG: 1,
  },
  {
    FIELD: "MAX_HEIGHT",
    LABEL: "批号",
    VTYPE: "",
    WIDTH: "200",
    ALIGN: "center",
    SELECTEDFLAG: 1,
  },
];
