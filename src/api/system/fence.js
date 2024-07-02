import request from '@/utils/request'
 // 新增保存接口
export function WLsubmit(data) {
    return request({
      url: '/base/fence/addNew',
      method: 'post',
      data
    })
}
//请求详情接口
export function WLdetail(data) {
    return request({
      url: '/base/fence/getDetailInfo',
      method: 'post',
      data
    })
}