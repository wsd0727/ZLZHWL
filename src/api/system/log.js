import request from '@/utils/request'
 // 查询左侧列表
export function LeftList(data) {
    return request({
      url: '/sys/sys-upgrade-records/getPageList',
      method: 'post',
      data
    })
}
 // 查询右侧列表
export function RightList(data) {
    return request({
      url: '/sys/sys-upgrade-records/getDetail',
      method: 'post',
      data
    })
}
 // 查询开发规范左侧列表
export function getGfLeftList(data) {
    return request({
      url: '/sys/help/explain/getPageList',
      method: 'post',
      data
    })
}
//右侧详情
export function getGfRightList(data) {
    return request({
      url: '/sys/help/explain/getDetail',
      method: 'post',
      data
    })
}
