import request from '@/utils/request'
// 查询地图
export function getCartrack(data) {
    return request({
        url: 'base/monitor/car/getTruck',
        method: 'post',
        data
    })
}