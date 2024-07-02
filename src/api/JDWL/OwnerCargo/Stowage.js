import request from '@/utils/request'

// 获取订单详情
export function getOrderDetail(data) {
  return request({
    url: "/oms/order/getSpecialDetail",
    method: "post",
    data
  })
}

export const QueryConfig = [
  { FIELD: "VNAME", LABEL: "名称", COL: 6, CONTROLS: "ExTextBox", ISSHOW: 1 },
  { FIELD: "AREACODE", LABEL: "区域", COL: 6, CONTROLS: "ExArea", ISSHOW: 1, OTHER: "/a???AREANAME=dataName" },
  { FIELD: "AREANAME", LABEL: "区域name", COL: 6, CONTROLS: "ExRead", ISSHOW: 0 },
  { FIELD: "PK_GROUP", LABEL: "分组", COL: 6, CONTROLS: "ExSelectSearch", ISSHOW: 1, OTHER: "/sys/component/getSelectTypeList?TYPE=204??GROUPNAME=LABEL" },
]

export function getCarrierGroup(data) {
  return request({
    url: "base/carrierGroup/getCarrierPageList",
    method: "post",
    data
  })
}

export const PZConfig = [
  { FIELD: "PK_DRIVER", LABEL: "司机", COL: 8, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 2, OTHER: "", ISREQUIRE: 1, LINKAGE: '{"ISSHOW":"Data.selectType==\'car\'"}' },
  { FIELD: "PK_CAR", LABEL: "车辆", COL: 8, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 2, OTHER: "", ISREQUIRE: 1, LINKAGE: '{"ISSHOW":"Data.selectType==\'driver\'"}' },
  { FIELD: "ROUND", LABEL: "次数", COL: 8, CONTROLS: "ExNumber", DEFAULTVAL: "1", ISSHOW: 1, SUFFIX: "趟", MAXLENGTH: "9999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0"}' },
  // { FIELD: "ROUND", LABEL: "次数", COL: 8, CONTROLS: "ExNumber", DEFAULTVAL: "1", ISSHOW: 2, SUFFIX: "次", MAXLENGTH: "9999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0","ISSHOW":"Data.assignMentUnit==\'4\'"}' },
  { FIELD: "ISONLINE", LABEL: "转网货", COL: 8, CONTROLS: "ExSwitch", DEFAULTVAL: "0", ISSHOW: 0, OTHER: "" },
  { FIELD: "SENDSTIME", LABEL: "开始运输", COL: 8, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, ISREQUIRE: 1, OTHER: "" },
  { FIELD: "SENDETIME", LABEL: "预计到达", COL: 8, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, ISREQUIRE: 1, OTHER: "" },
  { FIELD: "PROVIDER", LABEL: "服务方", COL: 8, CONTROLS: "ExSelect", DEFAULTVAL: "1", ISSHOW: 0, ISREQUIRE: 1, OTHER: '[{"LABEL":"司机","VALUE":"1"},{"LABEL":"车队","VALUE":"2"}]' },
]

export function savePZDriver(data) {
  return request({
    url: "/oms/app/orderDeal/trustDrivers",
    method: "post",
    data
  })
}

export function savePZCarrier(data) {
  return request({
    url: "/oms/app/orderDeal/trustCarriers",
    method: "post",
    data
  })
}