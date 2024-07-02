import request from '@/utils/request'

// 登录方法
export function getGanttData(data) {
  return request({
    url: 'plan/pl-sm002/getSTGantt',
    method: 'post',
    data
  })
}