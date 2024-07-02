import request from '@/utils/request'
 // 查询左侧树列表
export function TreeList(data) {
    return request({
      url: '/sys/help/wiki/getTreeList',
      method: 'post',
      data
    })
}
 // 查询右侧内容接口
export function rightContent(data) {
    return request({
      url: '/sys/help/wiki/getDetail',
      method: 'post',
      data
    })
}
