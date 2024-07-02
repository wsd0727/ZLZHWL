import request from '@/utils/request'

/** 获取片区 */
export function getAreaData(data) {
  return request({
    url: "/base/bd-area/getTreeList",
    method: "post",
    data
  })
}

/** 获取片区下车主 */
export function getAreaInOwner(data) {
  return request({
    url: "/tms/carOperaBoard/getTrend",
    method: "post",
    data
  })
}

/** 获取top10 */
export function getTop10(data) {
  return request({
    url: "/tms/carOperaBoard/getTOP10",
    method: "post",
    data
  })
}

/** 拉运趋势 */
export function getLYQS(data) {
  return request({
    url: "/tms/carOperaBoard/getTrend",
    method: "post",
    data
  })
}


/** 在线 离线 */
export function getInLine(data) {
  return request({
    url: "/tms/carOperaBoard/carOnLineCount",
    method: "post",
    data
  })
}

/** 运输状态 */
export function getCarStatus(data) {
  return request({
    url: "/tms/carOperaBoard/carTransportCount",
    method: "post",
    data
  })
}