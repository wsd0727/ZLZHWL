import request from '@/utils/request'

/** 获取 报号时间规则 数据*/
export function getSignOrderTimeRules() {
  return request({
    url: "/oms/dd-put-fre/slcPutFreTime",
    method: "post",
    data: {}
  })
}

/** 保存 报号时间规则*/
export function saveSignOrderTimeRules(data) {
  return request({
    url: "/oms/dd-put-fre/addPutFre",
    method: "post",
    data
  })
}

/** 删除频次 */
export function removeSignOrderTimeRules(data) {
  return request({
    url: "/oms/dd-put-fre/delFre",
    method: "post",
    data
  })
}

/** 获取 选单时间 */
export function getSelectTimeRules() {
  return request({
    url: "/oms/dd-put-fre/slTimeType",
    method: "post",
    data:{}
  })
}

/** 保存 选单时间规则*/
export function saveSelectTimeRules(data) {
  return request({
    url: "/oms/dd-put-fre/auTimeType",
    method: "post",
    data
  })
}

/** 保存 车辆排序规则 */
export function saveCarSortRules(data) {
  return request({
    url: "/oms/dd-put-fre/slCarSort",
    method: "post",
    data
  })
}