import request from '@/utils/request'

/** 获取片区 */
export function getAreaData(data) {
  return request({
    url: "/base/bd-area/getTreeList",
    method: "post",
    data
  })
}

/** 车辆运力 */
export function getCLYL(data) {
  return request({
    url: "/base/transport/capacity/carRatio",
    method: "post",
    data
  })
}

/** 运力池 车辆状态 */
export function getYLCCLZZ(data){
  return request({
    url:"/tms/carOperaBoard/carTransportCarCount",
    method:"post",
    data
  })
}

/** 车辆状态 */
export function getCLZZ(data) {
  return request({
    url: "/base/transport/capacity/carStatus",
    method: "post",
    data
  })
}

/** 异常预警 */
export function getYCYL() {
  return request({
    url: "/tms/carOperaBoard/warning",
    method: "post",
    data:{}
  })
}

/** 总运力 */
export function getZYL(data) {
  return request({
    url: "/tms/carOperaBoard/carPost",
    method: "post",
    data
  })
}

/** 平均趟数 */
export function getPJTS(data) {
  return request({
    url: "/tms/carOperaBoard/areaTranNumAvg",
    method: "post",
    data
  })
}

/** 省份车辆 */
export function getSFCL(data) {
  return request({
    url: "/tms/carOperaBoard/carOnLineStatus",
    method: "post",
    data
  })
}