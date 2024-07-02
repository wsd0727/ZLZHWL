import request from '@/utils/request'
//查询快捷入口接口
export function IconList(data) {
  return request({
    url: 'base/bd-userfastentry/getList',
    method: 'post',
    data
  })
}