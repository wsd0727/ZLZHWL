import request from '@/utils/request'

/** 获取订单 */
export function getOrderList(data) {
  return request({
    url: "/tms/tmsTransportDtl/getPageList",
    method: "post",
    data
  })
}

/** 获取派车单详情 + 明细 */
export function getOrderDetail(data) {
  return request({
    url: "/tms/tmsTransport/getDetail",
    method: "post",
    data
  })
}

/** 获取派车单 轨迹 */
export function getOrderMapLine(data) {
  return request({
    url: "/tms/tmsTransportPoints/getDetail",
    method: "post",
    data
  })
}

/** 获取任务单 路线监管信息 */
export function getLine(data) {
  return request({
    url: "/tms/tmsTransportNode/getNodeList",
    method: "post",
    data
  })
}

/** 获取任务单 货物信息 */
export function getGoods(data) {
  return request({
    url: "/tms/tmsTransportDtl/getSubList2",
    method: "post",
    data
  })
}

/** 获取派车单 签收信息 */
export function getSign(data) {
  return request({
    url: "/tms/tmsTransportSign/getSubList2",
    method: "post",
    data
  })
}

/** 获取派车单 预警信息 */
export function getWarn(data) {
  return request({
    url: "/tms/tmsWarninfo/getSubList",
    method: "post",
    data
  })
}

/** 获取车辆当前位置 */
export function getCarNewLocation(data) {
  return request({
    url: "/tms/tmsTransport/carGpsByPkSendCar",
    method: "post",
    data
  })
}