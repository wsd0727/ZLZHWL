import request from '@/utils/request'
// 查询角色已授权用户列表
export function reportList(query) {
    return request({
        url: '/sys/report/index',
        method: 'get',
        params: query,
        data:{}
    })
}