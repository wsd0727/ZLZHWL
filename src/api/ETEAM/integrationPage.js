import request from '@/utils/request'
//查询表格
export function getPageList(data) {
    return request({
        url: 'bd-knowledge-integral-log/getRankList',
        method: 'post',
        data
    })
}
//查询右侧表格
export function getRightPageList(data) {
    return request({
        url: '/bd-knowledge-integral-log/getUserIntegral',
        method: 'post',
        data
    })
}