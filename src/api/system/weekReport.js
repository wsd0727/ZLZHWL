import request from '@/utils/request'
// 查询类型列表
export function reportList(data) {
    return request({
        url: 'dictDtl/queryDictInfoByCode/reportType',
        method: 'post',
        data
    })
}
//获取人员信息
export function UserList(data) {
    return request({
        url: 'sys/user/getTreeList',
        method: 'post',
        data
    })
}
//周报新增
export function weekAdd(data) {
    return request({
        url: 'bd-daily-and-weekly/addWeekly',
        method: 'post',
        data
    })
}
//左侧树
export function getLeftList(data) {
    return request({
        url: 'bd-daily-and-weekly/getPageList',
        method: 'post',
        data
    })
}
//右侧详情
export function getRightist(data) {
    return request({
        url: 'bd-daily-and-weekly/getDetail',
        method: 'post',
        data
    })
}
//评论列表
export function getPllist(data) {
    return request({
        url: 'bd-dw-evaluate/getPageList',
        method: 'post',
        data
    })
}
//评论新增
export function addPL(data) {
    return request({
        url: 'bd-dw-evaluate/add',
        method: 'post',
        data
    })
}
//删除评论
export function deletePL(data) {
    return request({
        url: 'bd-dw-evaluate/deleteBatchIds',
        method: 'post',
        data
    })
}
//点赞
export function DZadd(data) {
    return request({
        url: 'bd-dw-give/add',
        method: 'post',
        data
    })
}
//点赞列表
export function DZlist(data) {
    return request({
        url: 'bd-dw-give/getPageList',
        method: 'post',
        data
    })
}
//周报统计接口
export function TJlist(data) {
    return request({
        url: 'bd-daily-report-state/getPageList',
        method: 'post',
        data
    })
}
//周报统计列表
export function getTJList(data) {
    return request({
        url: 'bd-daily-report-state/getPageList',
        method: 'post',
        data
    })
}
//周报统计详情接口
export function getTJDetail(data) {
    return request({
        url: 'bd-daily-report-state/getDetail',
        method: 'post',
        data
    })
}