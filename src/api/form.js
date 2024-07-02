import request from '@/utils/request'

// 单据历史记录
export function BillsHistory(data) {
  return request({
    url: "/dynamic/component/getOperateList",
    method: "post",
    data
  })
}
