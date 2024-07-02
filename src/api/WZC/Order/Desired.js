import request from '@/utils/request'

/** 查询 符合规则的需求 */
export function getHasRulesOrder(data) {
  return request({
    url: "/oms/demand/getMergeDemand",
    method: "post",
    data
  })
}

/** 获取规则  */
export function getRules(data) {
  return request({
    // url: "/oms/component/getSelectTypeList",
    url: "/oms/demandPolicy/getSpecialPolicyList",
    method: "post",
    data
  })
}

/** 提交 合并数据 */
export function saveHasRulesOrder(data) {
  return request({
    url: "/oms/demand/handleDemand",
    method: "post",
    data
  })
}