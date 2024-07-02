import request from '@/utils/request'


// 获取商务评分细则
export function getEvaluationScoreRubricList(data) {
  return request({
    url: "/oms/tenderAppriseScoreRubric/getEvaluationScoreRubricList",
    method: "post",
    data
  })
}
// 保存商务评分细则
export function saveData(data) {
  return request({
    url: "/oms/tenderAppriseScoreRubric/add",
    method: "post",
    data
  })
}
