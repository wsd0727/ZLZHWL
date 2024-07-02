import request from '@/utils/request'

// // 获取委托单详情
// export function getWTOrderDetail(data) {
//   return request({
//     url: "/oms/tsdepute/getTsDeputeAndDetail",
//     method: "post",
//     data
//   })
// }

export const QueryConfig = [
  { FIELD: "CARNO", LABEL: "车辆", COL: 6, CONTROLS: "ExTextBox", ISSHOW: 1, type: "car" },
  { FIELD: "DRIVERNAME", LABEL: "司机", COL: 6, CONTROLS: "ExTextBox", ISSHOW: 1, type: "driver", },
  //   { FIELD: "PK_GROUP", LABEL: "分组", COL: 6, CONTROLS: "ExSelectSearch", ISSHOW: 1, type: "driver", OTHER: "/dynamic/component/getSelectTypeList?TYPE=205??GROUPNAME=LABEL" },
  { FIELD: "STATUS", LABEL: "状态", COL: 6, CONTROLS: "ExSelect", ISSHOW: 1, SLOT: 1, OTHER: '[{"LABEL":"空闲","VALUE":"0"},{"LABEL":"占用","VALUE":"1"}]', type: "driver" },
]

// // 获取 选车辆 列表数据
// export function getPZCars(data) {
//   return request({
//     url: "/oms/tsdeputeDeal/getCarsAndDriversByDispatch",
//     method: "post",
//     data
//   })
// }

// // 获取 选司机 列表数据
// export function getPZDrivers(data) {
//   return request({
//     url: "/oms/tsdeputeDeal/getDriversAndCarsByDispatch",
//     method: "post",
//     data
//   })
// }

// // 获取 车辆\司机 拉运记录
// export function getOrderHistory(data) {
//   return request({
//     url: "/tms/tmsTransport/getPageList",
//     method: "post",
//     data
//   })
// }

// // 获取全部车辆
// export function getBaseCar(data) {
//   return request({
//     url: "/base/cars/getCarInfoWithFree",
//     method: "post",
//     data
//   })
// }
// // 获取全部司机（分组）
// export function getDriverGroup(data) {
//   return request({
//     url: "/base/driverGroup/getTreeList",
//     method: "post",
//     data
//   })
// }

// export const PZConfig = [
//   { FIELD: "PK_DRIVER", LABEL: "司机", COL: 8, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 2, OTHER: "", ISREQUIRE: 1, LINKAGE: '{"ISSHOW":"Data.selectType==\'car\'"}' },
//   { FIELD: "PK_CAR", LABEL: "车辆", COL: 8, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 2, OTHER: "", ISREQUIRE: 1, LINKAGE: '{"ISSHOW":"Data.selectType==\'driver\'"}' },
//   { FIELD: "ROUND", LABEL: "次数", COL: 8, CONTROLS: "ExNumber", MAXLENGTH: "200", DEFAULTVAL: "1", ISSHOW: 1, SUFFIX: "趟", MAXLENGTH: "999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0"}' },
//   // { FIELD: "TRAINNUMBER", LABEL: "次数", COL: 8, CONTROLS: "ExNumber", DEFAULTVAL: "1", ISSHOW: 1, SUFFIX: "次", MAXLENGTH: "9999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0","ISSHOW":"Data.assignMentUnit==\'4\'"}' },
//   { FIELD: "ISONLINE", LABEL: "转网货", COL: 8, CONTROLS: "ExSwitch", DEFAULTVAL: "0", ISSHOW: 1, OTHER: "" },
//   { FIELD: "STARTDATE", LABEL: "开始运输", COL: 8, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, ISREQUIRE: 1, OTHER: "" },
//   { FIELD: "ETADATE", LABEL: "预计到达", COL: 8, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, ISREQUIRE: 1, OTHER: "" },
//   { FIELD: "PROVIDER", LABEL: "服务方", COL: 8, CONTROLS: "ExSelect", DEFAULTVAL: "1", ISREQUIRE: 1, ISSHOW: 2, LINKAGE: '{"ISSHOW":"Data.ISONLINE==\'1\'"}', OTHER: '[{"LABEL":"司机","VALUE":"1"},{"LABEL":"车队","VALUE":"2"}]' },
// ]

// export function savePZ(data) {
//   return request({
//     url: "/oms/tsdeputeDeal/createDisPatch",
//     method: "post",
//     data
//   })
// }