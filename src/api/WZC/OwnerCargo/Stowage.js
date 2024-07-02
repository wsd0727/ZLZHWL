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
  { FIELD: "SENDSTIME", LABEL: "开始运输", COL: 8, CONTROLS: "ExDate", MAXLENGTH: "20", ISSHOW: 2, ISREQUIRE: 1, OTHER: "", LINKAGE: '{"ISSHOW":"Data.BUSSTYPE==\'1\'"}', },
  { FIELD: "SENDETIME", LABEL: "预计到达", COL: 8, CONTROLS: "ExDate", MAXLENGTH: "20", ISSHOW: 2, ISREQUIRE: 1, OTHER: "", LINKAGE: '{"ISSHOW":"Data.BUSSTYPE==\'2\'"}', },
  // { FIELD: "PK_QUEUE", LABEL: "预约时间段", COL: 8, CONTROLS: "ExSelectSearch", OTHER: "/tms/queueGroup/getSelectList??PK_COMPANY=PK_COMPANY", ISSHOW: 1, ISREQUIRE: 0, },
  { FIELD: "ENTRYDATE", LABEL: "预约时间段", COL: 8, CONTROLS: "ExRegion", OTHER: "/tms/queueGroup/getSelectDateList?PK_FACTORY=?PK_COMPANY=EXPECTENTRYCOMPANY&STARTDATE=EXPECTENTRYTIME", ISSHOW: 1, ISREQUIRE: 1, },
  { FIELD: "PROVIDER", LABEL: "服务方", COL: 8, CONTROLS: "ExSelect", DEFAULTVAL: "1", ISSHOW: 0, ISREQUIRE: 1, OTHER: '[{"LABEL":"司机","VALUE":"1"},{"LABEL":"车队","VALUE":"2"}]' },
  { FIELD: "ISXX", LABEL: "是否卸箱", COL: 8, CONTROLS: "ExSwitch", DEFAULTVAL: "0", ISSHOW: 2, OTHER: "", LINKAGE: '{"ISSHOW":"Data.CONTAINERSERVICE==\'1\'"}', },
  { FIELD: "CONTAINERNO", LABEL: "集装箱号", COL: 8, CONTROLS: "ExTextBox", DEFAULTVAL: "1", ISREQUIRE: 1, ISSHOW: 2, LINKAGE: '{"ISSHOW":"Data.ISXX==\'1\'"}', OTHER: '' },
]
export const ZLPZConfig = [
  { FIELD: "PK_DRIVER", LABEL: "司机", COL: 8, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 2, OTHER: "", ISREQUIRE: 1, LINKAGE: '{"ISSHOW":"Data.selectType==\'car\'"}' },
  { FIELD: "PK_CAR", LABEL: "车辆", COL: 8, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 2, OTHER: "", ISREQUIRE: 1, LINKAGE: '{"ISSHOW":"Data.selectType==\'driver\'"}' },
  { FIELD: "ROUND", LABEL: "次数", COL: 8, CONTROLS: "ExNumber", DEFAULTVAL: "1", ISSHOW: 1, SUFFIX: "趟", MAXLENGTH: "9999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0"}' },
  // { FIELD: "ROUND", LABEL: "次数", COL: 8, CONTROLS: "ExNumber", DEFAULTVAL: "1", ISSHOW: 2, SUFFIX: "次", MAXLENGTH: "9999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0","ISSHOW":"Data.assignMentUnit==\'4\'"}' },
  { FIELD: "ISONLINE", LABEL: "转网货", COL: 8, CONTROLS: "ExSwitch", DEFAULTVAL: "0", ISSHOW: 0, OTHER: "" },
  { FIELD: "SENDSTIME", LABEL: "开始运输", COL: 8, CONTROLS: "ExDate", MAXLENGTH: "20", ISSHOW: 2, ISREQUIRE: 1, OTHER: "", LINKAGE: '{"ISSHOW":"Data.BUSSTYPE==\'1\'"}', },
  { FIELD: "SENDETIME", LABEL: "预计到达", COL: 8, CONTROLS: "ExDate", MAXLENGTH: "20", ISSHOW: 2, ISREQUIRE: 1, OTHER: "", LINKAGE: '{"ISSHOW":"Data.BUSSTYPE==\'2\'"}', },
  // { FIELD: "PK_QUEUE", LABEL: "预约时间段", COL: 8, CONTROLS: "ExSelectSearch", OTHER: "/tms/queueGroup/getSelectList??PK_COMPANY=PK_COMPANY", ISSHOW: 1, ISREQUIRE: 0, },
  { FIELD: "ENTRYDATE", LABEL: "预约时间段", COL: 8, CONTROLS: "ExRegion", OTHER: "/tms/queueGroup/getSelectDateList?PK_FACTORY=?PK_COMPANY=EXPECTENTRYCOMPANY&STARTDATE=EXPECTENTRYTIME", ISSHOW: 1, ISREQUIRE: 0, },
  { FIELD: "PROVIDER", LABEL: "服务方", COL: 8, CONTROLS: "ExSelect", DEFAULTVAL: "1", ISSHOW: 0, ISREQUIRE: 1, OTHER: '[{"LABEL":"司机","VALUE":"1"},{"LABEL":"车队","VALUE":"2"}]' },
  { FIELD: "ISXX", LABEL: "是否卸箱", COL: 8, CONTROLS: "ExSwitch", DEFAULTVAL: "0", ISSHOW: 2, OTHER: "", LINKAGE: '{"ISSHOW":"Data.CONTAINERSERVICE==\'1\'"}', },
  { FIELD: "CONTAINERNO", LABEL: "集装箱号", COL: 8, CONTROLS: "ExTextBox", DEFAULTVAL: "1", ISREQUIRE: 1, ISSHOW: 2, LINKAGE: '{"ISSHOW":"Data.ISXX==\'1\'"}', OTHER: '' },
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