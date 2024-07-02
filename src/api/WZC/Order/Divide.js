import request from '@/utils/request'

/** 获取需求详情信息 */
export function getDetail(data) {
  return request({
    url: "/oms/demand/getDetail",
    method: "post",
    data
  })
}

/** 保存按段拆分信息 */
export function saveDivide(data) {
  return request({
    url: "/oms/demand/handleDemand",
    method: "post",
    data
  })
}

export function getWl(data) {
  return request({
    url: "/base/component/getSelectTypeList?",
    method: "post",
    data
  })
}