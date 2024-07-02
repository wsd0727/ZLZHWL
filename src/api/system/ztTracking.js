import request from '@/utils/request'
//查询快捷入口接口
export function getTreeData(data) {
  return request({
    url: '/tms/tranorder/getRouteTruck',
    method: 'post',
    data
  })
}