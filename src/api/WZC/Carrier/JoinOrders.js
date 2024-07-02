import request from '@/utils/request'

// 获取委托单详情
// export function getWTOrderDetail(data) {
//     return request({
//         url: "/oms/tsdepute/getTsDeputeAndDetail",
//         method: "post",
//         data
//     })
// }

// export const FormConfig = [
//     { FIELD: "CARNO", LABEL: "车牌号", COL: 6, CONTROLS: "ExTextBox", ISSHOW: 1, type: "car" },
//     { FIELD: "DRIVERNAME", LABEL: "核载量", COL: 6, CONTROLS: "ExReadCard", ISSHOW: 1, type: "driver", },
//     { FIELD: "STATUS", LABEL: "司机", COL: 6, CONTROLS: "ExSelect", ISSHOW: 1, SLOT: 1, OTHER: '[{"LABEL":"空闲","VALUE":"0"},{"LABEL":"占用","VALUE":"1"}]', type: "driver" },
//     { FIELD: "STATUS", LABEL: "拉运次数", COL: 6, CONTROLS: "ExSelect", ISSHOW: 1, SLOT: 1, OTHER: '[{"LABEL":"空闲","VALUE":"0"},{"LABEL":"占用","VALUE":"1"}]', type: "driver" },
//     { FIELD: "STATUS", LABEL: "运输开始时间", COL: 6, CONTROLS: "ExSelect", ISSHOW: 1, SLOT: 1, OTHER: '[{"LABEL":"空闲","VALUE":"0"},{"LABEL":"占用","VALUE":"1"}]', type: "driver" },
//     { FIELD: "STATUS", LABEL: "计划送达时间", COL: 6, CONTROLS: "ExSelect", ISSHOW: 1, SLOT: 1, OTHER: '[{"LABEL":"空闲","VALUE":"0"},{"LABEL":"占用","VALUE":"1"}]', type: "driver" },
//     { FIELD: "STATUS", LABEL: "是否转网货", COL: 6, CONTROLS: "ExSelect", ISSHOW: 1, SLOT: 1, OTHER: '[{"LABEL":"空闲","VALUE":"0"},{"LABEL":"占用","VALUE":"1"}]', type: "driver" },
//     { FIELD: "STATUS", LABEL: "服务方", COL: 6, CONTROLS: "ExSelect", ISSHOW: 1, SLOT: 1, OTHER: '[{"LABEL":"空闲","VALUE":"0"},{"LABEL":"占用","VALUE":"1"}]', type: "driver" },
// ]

// 获取 选车辆 列表数据
export function getPZCars(data) {
    return request({
        url: "/oms/tsdeputeDeal/getCarsAndDriversByDispatch",
        method: "post",
        data
    })
}

// 获取 下方左侧列表
export function getLeftList(data) {
    return request({
        url: "/oms/tsdeputeDtl/getSubListByPolicy",
        method: "post",
        data
    })
}

// // 获取 车辆\司机 拉运记录
// export function getOrderHistory(data) {
//     return request({
//         url: "/tms/tmsTransport/getPageList",
//         method: "post",
//         data
//     })
// }

// 获取全部车辆
export function getBaseCar(data) {
    return request({
        url: "/base/cars/getCarInfoWithFree",
        method: "post",
        data
    })
}
// 获取全部司机（分组）
export function getDriverGroup(data) {
    return request({
        url: "/base/driverGroup/getTreeList",
        method: "post",
        data
    })
}

export const PZConfig = [
    { FIELD: "PK_CAR", LABEL: "车牌号", COL: 6, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
    { FIELD: "LOADWEIGHT", LABEL: "核载量", COL: 6, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
    { FIELD: "PK_DRIVER", LABEL: "司机", COL: 6, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
    { FIELD: "ROUND", LABEL: "拉运次数", COL: 6, CONTROLS: "ExNumber", MAXLENGTH: "200", DEFAULTVAL: 1, ISSHOW: 1, SUFFIX: "趟", MAXLENGTH: "999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0"}'},
    //   { FIELD: "TRAINNUMBER", LABEL: "拉运次数", COL: 8, CONTROLS: "ExNumber", DEFAULTVAL: "1", ISSHOW: 1, SUFFIX: "次", MAXLENGTH: "9999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0","ISSHOW":"Data.assignMentUnit==\'4\'"}' },
    // { FIELD: "STARTDATE", LABEL: "要求开始时间", COL: 6, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, ISREQUIRE: 1, OTHER: "" },
    // { FIELD: "ETADATE", LABEL: "要求送达时间", COL: 6, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, ISREQUIRE: 1, OTHER: "" },
    // { FIELD: "ISONLINE", LABEL: "转网货", COL: 6, CONTROLS: "ExSwitch", DEFAULTVAL: "0", ISSHOW: 1, OTHER: "" },
    // { FIELD: "PROVIDER", LABEL: "服务方", COL: 6, CONTROLS: "ExSelect", DEFAULTVAL: "1", ISREQUIRE: 1, ISSHOW: 2, LINKAGE: '{"ISSHOW":"Data.ISONLINE==\'1\'"}', OTHER: '[{"LABEL":"司机","VALUE":"1"},{"LABEL":"车队","VALUE":"2"}]' },
    { FIELD: "STARTDATE", LABEL: "开始运输", COL: 6, CONTROLS: "ExDate", MAXLENGTH: "20", ISSHOW: 2, ISREQUIRE: 1, OTHER: "", LINKAGE: '{"ISSHOW":"Data.BUSSTYPE==\'1\'"}', },
    { FIELD: "ETADATE", LABEL: "预计到达", COL: 6, CONTROLS: "ExDate", MAXLENGTH: "20", ISSHOW: 2, ISREQUIRE: 1, OTHER: "", LINKAGE: '{"ISSHOW":"Data.BUSSTYPE==\'2\'"}' },
    { FIELD: "ENTRYDATE", LABEL: "预约时间段", COL: 6, CONTROLS: "ExRegion", OTHER: "/tms/queueGroup/getSelectDateList?PK_FACTORY=?PK_COMPANY=EXPECTENTRYCOMPANY&STARTDATE=EXPECTENTRYTIME", ISSHOW: 1, ISREQUIRE: 1, },
    { FIELD: "PROVIDER", LABEL: "服务方", COL: 6, CONTROLS: "ExSelect", DEFAULTVAL: "1", ISREQUIRE: 1, ISSHOW: 2, LINKAGE: '{"ISSHOW":"Data.ISONLINE==\'1\'"}', OTHER: '[{"LABEL":"司机","VALUE":"1"},{"LABEL":"车队","VALUE":"2"}]' },
    { FIELD: "ISXX", LABEL: "是否卸箱", COL: 6, CONTROLS: "ExSwitch", DEFAULTVAL: "0", ISSHOW: 2, OTHER: "", LINKAGE: '{"ISSHOW":"Data.CONTAINERSERVICE==\'1\'"}', },
    { FIELD: "CONTAINERNO", LABEL: "集装箱号", COL: 6, CONTROLS: "ExTextBox", DEFAULTVAL: "1", ISREQUIRE: 1, ISSHOW: 2, LINKAGE: '{"ISSHOW":"Data.ISXX==\'1\'"}', OTHER: '' },

]
export const ZLPZConfig = [
    { FIELD: "PK_CAR", LABEL: "车牌号", COL: 6, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
    { FIELD: "LOADWEIGHT", LABEL: "核载量", COL: 6, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
    { FIELD: "PK_DRIVER", LABEL: "司机", COL: 6, CONTROLS: "slot", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
    { FIELD: "ROUND", LABEL: "拉运次数", COL: 6, CONTROLS: "ExNumber", MAXLENGTH: "200", DEFAULTVAL: 1, ISSHOW: 1, SUFFIX: "趟", MAXLENGTH: "999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0"}'},
    //   { FIELD: "TRAINNUMBER", LABEL: "拉运次数", COL: 8, CONTROLS: "ExNumber", DEFAULTVAL: "1", ISSHOW: 1, SUFFIX: "次", MAXLENGTH: "9999", ISREQUIRE: 1, OTHER: "", SLOTCFG: '{"MIN":"1"}', LINKAGE: '{"POINT":"0","ISSHOW":"Data.assignMentUnit==\'4\'"}' },
    // { FIELD: "STARTDATE", LABEL: "要求开始时间", COL: 6, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, ISREQUIRE: 1, OTHER: "" },
    // { FIELD: "ETADATE", LABEL: "要求送达时间", COL: 6, CONTROLS: "ExDateTime", MAXLENGTH: "200", ISSHOW: 1, ISREQUIRE: 1, OTHER: "" },
    // { FIELD: "ISONLINE", LABEL: "转网货", COL: 6, CONTROLS: "ExSwitch", DEFAULTVAL: "0", ISSHOW: 1, OTHER: "" },
    // { FIELD: "PROVIDER", LABEL: "服务方", COL: 6, CONTROLS: "ExSelect", DEFAULTVAL: "1", ISREQUIRE: 1, ISSHOW: 2, LINKAGE: '{"ISSHOW":"Data.ISONLINE==\'1\'"}', OTHER: '[{"LABEL":"司机","VALUE":"1"},{"LABEL":"车队","VALUE":"2"}]' },
    { FIELD: "STARTDATE", LABEL: "开始运输", COL: 6, CONTROLS: "ExDate", MAXLENGTH: "20", ISSHOW: 2, ISREQUIRE: 1, OTHER: "", LINKAGE: '{"ISSHOW":"Data.BUSSTYPE==\'1\'"}', },
    { FIELD: "ETADATE", LABEL: "预计到达", COL: 6, CONTROLS: "ExDate", MAXLENGTH: "20", ISSHOW: 2, ISREQUIRE: 1, OTHER: "", LINKAGE: '{"ISSHOW":"Data.BUSSTYPE==\'2\'"}' },
    { FIELD: "ENTRYDATE", LABEL: "预约时间段", COL: 6, CONTROLS: "ExRegion", OTHER: "/tms/queueGroup/getSelectDateList?PK_FACTORY=?PK_COMPANY=EXPECTENTRYCOMPANY&STARTDATE=EXPECTENTRYTIME", ISSHOW: 1, ISREQUIRE: 0, },
    { FIELD: "PROVIDER", LABEL: "服务方", COL: 6, CONTROLS: "ExSelect", DEFAULTVAL: "1", ISREQUIRE: 1, ISSHOW: 2, LINKAGE: '{"ISSHOW":"Data.ISONLINE==\'1\'"}', OTHER: '[{"LABEL":"司机","VALUE":"1"},{"LABEL":"车队","VALUE":"2"}]' },
    { FIELD: "ISXX", LABEL: "是否卸箱", COL: 6, CONTROLS: "ExSwitch", DEFAULTVAL: "0", ISSHOW: 2, OTHER: "", LINKAGE: '{"ISSHOW":"Data.CONTAINERSERVICE==\'1\'"}', },
    { FIELD: "CONTAINERNO", LABEL: "集装箱号", COL: 6, CONTROLS: "ExTextBox", DEFAULTVAL: "1", ISREQUIRE: 1, ISSHOW: 2, LINKAGE: '{"ISSHOW":"Data.ISXX==\'1\'"}', OTHER: '' },

]
export const QueryConfig = [
    { FIELD: "POLICYBILLNO", LABEL: "合单规则", COL: 12, CONTROLS: "ExSelectSearch", DEFAULTVAL: "1", ISREQUIRE: 1, ISSHOW: 1, OTHER: '/oms/deputePolicy/getSelectList' },
]


// 3.2.16.尾差合单-尾差配载司机
export function savePZ(data) {
    return request({
        url: "/oms/tsdeputeDeal/createTailDisPatch",
        method: "post",
        data
    })
}


export function getDeputeInfo(data) {
    return request({
        url: "/oms/tsdepute/getDeputeInfo",
        method: "post",
        data
    })
}