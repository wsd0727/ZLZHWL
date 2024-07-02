
import request from '@/utils/request'

// 查询报表模板
export function getReportPost(url, data) {
    return request({
        // url: 'base/bdcarrevalutemplatedtl/getTemplateInfo',
        url: url ,
        method: 'post',
        data
    })
}

// 编辑保存报表模板
export function updetaReportPost(url, data) {
    return request({
        // url: 'base/bdcarrevaluationdtl/batchSave',
        url: url ,
        method: 'post',
        data
    })
}

//审核保存报表模板
export function updetaReportexamine(data) {
    return request({
        url: 'base/bdcarrevaluation/updateStatus',
        url: url ,
        method: 'post',
        data
    })
}


//获取原发录入和签收量
export function getOrinfo(data) {
    return request({
        url: '/tms/tmsTransportOriginal/getOrinfo',
        method: 'post',
        data
    })
}



