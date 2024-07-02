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
    url: "/tms/tmsTransportNode/getDetail",
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
    url: "/tms/tmsTransportDtl/getSubList",
    method: "post",
    data
  })
}

/** 获取派车单 签收信息 */
export function getSign(data) {
  return request({
    url: "/tms/tmsTransportSign/getSubList",
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

/** 获取众联的装货信息 */
export function getTransportOriginal(data) {
  return request({
    // url: "/tms/tmsTransportOriginal/getPageList",
    url: "/tms/tmsTransportOriginal/getSubList",
    method: "post",
    data
  })
}
/** 获取众联的卸货信息 */
// export function getTransportSign(data) {
//   return request({
//     url: "/tms/tmsTransportSign/getPageList",
//     method: "post",
//     data
//   })
// }

// 获取众联的对账单信息
export function getStatementAccount(data) {
  return request({
    url: "/bms/account/getSubListZl",
    method: "post",
    data
  })
}

// 获取众联的结算单信息
export function getFinalStatement(data) {
  return request({
    url: "/bms/settle/getSubListZlJS",
    method: "post",
    data
  })
}

// 获取众联的发票信息
export function getSubListByZL(data) {
  return request({
    url: "/bms/invoiceDtl/getSubListByZL",
    method: "post",
    data
  })
}

// 获取众联的付款明细
export function getPaymentDtl(data) {
  return request({
    url: "/bms/paymentDtl/getSubListByZL",
    method: "post",
    data
  })
}


