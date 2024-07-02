import request from '@/utils/request'

// 获取委托单详情
export function getWTOrderDetail(data) {
  return request({
    url: "/oms/tsdepute/getTsDeputeAndDetail",
    method: "post",
    data
  })
}

export const QueryConfig = [
  { FIELD: "VNAME", LABEL: "名称", COL: 6, CONTROLS: "ExTextBox", ISSHOW: 1, type: "car" },
  // { FIELD: "STATUS", LABEL: "状态", COL: 6, CONTROLS: "ExSelect", ISSHOW: 1, SLOT: 1, OTHER: '[{"LABEL":"空闲","VALUE":"0"},{"LABEL":"占用","VALUE":"1"}]', type: "driver" },
]

// 获取 选船舶 列表数据
export function getPZBoth(data) {
  return request({
    url: "/oms/shipsTsdeputeDeal/getShipsByDispatch",
    method: "post",
    data
  })
}

// 获取 拉运记录
export function getOrderHistory(data) {
  return request({
    url: "/tms/tmsShipsTransport/getShipTranRecordPageList",
    method: "post",
    data
  })
}

export const PZConfig = [
  { FIELD: "ROUND", LABEL: "次数", COL: 8, CONTROLS: "ExNumber", MAXLENGTH: "200", DEFAULTVAL: "1", ISSHOW: 1, SUFFIX: "趟", MAXLENGTH: "999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0"}' },
  { FIELD: "STARTDATE", LABEL: "开始运输", COL: 8, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, ISREQUIRE: 1, OTHER: "" },
  { FIELD: "ETADATE", LABEL: "预计到达", COL: 8, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, ISREQUIRE: 1, OTHER: "" },
  { FIELD: "CONTAINERNUM", LABEL: "集装箱", COL: 8, CONTROLS: "ExNumber", DEFAULTVAL: "", ISREQUIRE: 1, ISSHOW: 2, SUFFIX: "个", LINKAGE: '{"ISSHOW":"Data.LOADINGMETHOD==\'1\'"}', OTHER: '' },
  { FIELD: "TOTALENTRUSTNUM", LABEL: "委托量", COL: 8, CONTROLS: "ExNumber", DEFAULTVAL: "", ISREQUIRE: 1, ISSHOW: 2, SUFFIX: "吨", LINKAGE: '{"ISSHOW":"Data.LOADINGMETHOD==\'1\'"}', OTHER: '' },
]

export function savePZ(data) {
  return request({
    url: "/oms/shipsTsdeputeDeal/createShipsDisPatch",
    method: "post",
    data
  })
}