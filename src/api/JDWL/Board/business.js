import request from '@/utils/request'

/** 获取片区 */
export function getAreaData(data) {
  return request({
    url: "/base/bd-area/getTreeList",
    method: "post",
    data
  })
}

/** 结构分布/同期比 */
export function getJGFB(data) {
  return request({
    url: "/bms/bmsBoard/areaReceivable",
    method: "post",
    data
  })
}

/** 月度收入 */
export function getYDSR(data) {
  return request({
    url: "/bms/bmsBoard/areaReceivableMonth",
    method: "post",
    data
  })
}

/** 费用 */
export function getFY(data) {
  return request({
    url: "/bms/bmsBoard/expandCost",
    method: "post",
    data
  })
}

/** 净利率 */
export function getJLL(data) {
  return request({
    url: "/bms/bmsBoard/expandNetProfitMargin",
    method: "post",
    data
  })
}

/** 纳税 */
export function getNS(data) {
  return request({
    url: "/bms/bmsBoard/expandTaxes",
    method: "post",
    data
  })
}

/** 月度成本 */
export function getYDCB(data) {
  return request({
    url: "/bms/bmsBoard/expandAdjustMonth",
    method: "post",
    data
  })
}

/** 超额成本 同期比 */
export function getCECBTQB(data) {
  return request({
    url: "/bms/bmsBoard/expandAdjustArea",
    method: "post",
    data
  })
}