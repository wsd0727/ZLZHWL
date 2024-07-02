
const STATUS = [
  { LABEL: "", VALUE: "" }
]
export const QueryConfig = [
  { LABEL: "时间", FIELD: "STARTTIME", CONTROLS: "ExDateTimeRange", COL: 6, ISSHOW: 1, DEFAULTVAL: "-7", GROUPID: '1' },
  { LABEL: "单号", FIELD: "BILLNO", CONTROLS: "ExTextBox", COL: 6, ISSHOW: 1, DEFAULTVAL: "", GROUPID: '1' },
  { LABEL: "车号", FIELD: "CARNAME", CONTROLS: "ExTextBox", COL: 6, ISSHOW: 1, DEFAULTVAL: "", GROUPID: '1' },
  { LABEL: "司机", FIELD: "DRIVERNAME", CONTROLS: "ExTextBox", COL: 6, ISSHOW: 1, DEFAULTVAL: "" },
  { LABEL: "状态", FIELD: "STATUS", CONTROLS: "ExSelect", COL: 6, ISSHOW: 1, DEFAULTVAL: "", OTHER: JSON.stringify(STATUS), GROUPID: '1' },
  { LABEL: "承运商", FIELD: "BILLNO", CONTROLS: "ExTextBox", COL: 4, ISSHOW: 1, DEFAULTVAL: "" },
  { LABEL: "货源地", FIELD: "START", CONTROLS: "ExTextBox", COL: 4, ISSHOW: 1, DEFAULTVAL: "" },
  { LABEL: "目的地", FIELD: "END", CONTROLS: "ExTextBox", COL: 4, ISSHOW: 1, DEFAULTVAL: "" },
]