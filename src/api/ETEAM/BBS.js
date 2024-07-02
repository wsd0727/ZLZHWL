import request from '@/utils/request'
//查询左侧树
export function getDictsTree(data) {
    return request({
        url: '/bd-knowledge-help/getTypeTreeList',
        method: 'post',
        data
    })
}
//查询表格
export function getPageList(data) {
    return request({
        url: '/bd-knowledge-help/getPageList',
        method: 'post',
        data
    })
}
//提问新增
export function addPageList(data) {
    return request({
        url: '/bd-knowledge-help/add',
        method: 'post',
        data
    })
}
//详情接口
export function getDetail(data) {
    return request({
        url: '/bd-knowledge-help/getDetail',
        method: 'post',
        data
    })
}
//编辑保存
export function getUpdate(data) {
    return request({
        url: '/bd-knowledge-help/update',
        method: 'post',
        data
    })
}
//删除
export function getDetele(data) {
    return request({
        url: '/bd-knowledge-help/deleteBatchIds',
        method: 'post',
        data
    })
}
//详情
export function detailItem(data) {
    return request({
        url: '/bd-knowledge-help/getDetail',
        method: 'post',
        data
    })
}
//评论列表
export function getWDList(data) {
    return request({
        url: 'bd-knowledge-ask-reply/getReplyInfo',
        method: 'post',
        data
    })
}
//收藏
export function getFork(data) {
    return request({
        url: 'bd-knowledge-collect/add',
        method: 'post',
        data
    })
}
//点赞
export function getDW(data) {
    return request({
        url: 'bd-knowledge-help/updateStatus',
        method: 'post',
        data
    })
}
//设为最佳
export function getSZZJ(data) {
    return request({
        url: 'bd-knowledge-ask-reply/bestAnswer',
        method: 'post',
        data
    })
}
//我要提问
export function getTwAdd(data) {
    return request({
        url: 'bd-knowledge-ask-reply/add',
        method: 'post',
        data
    })
}
//删除附件
export function delProStageFile(data) {
    return request({
        url: 'bd-knowledge-help/deleteFile',
        method: 'post',
        data
    })
}
// 用户表单配置
export const FormConfig = [
    { FIELD: "PK_ORG", LABEL: "所属类别", COL: 24, CONTROLS: "ExSelectGroup", ISREQUIRE: 1, ISSHOW: 1, OTHER: "bd-knowledge-help/getTypeTreeList???TYPENAME=LABEL&TYPE=VALUE", LINKAGE: "{\"CLEAN\":\"PK_DEPT\"}", REVERFIELD: 'TYPENAME' },
    { FIELD: "FILETITLE", LABEL: "标题", COL: 24, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "CONTENTS", LABEL: "内容", COL: 24, CONTROLS: "ExEditor", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', LINKAGE: "{\"CLEAN\":\"PK_ROLE\"}" },
    { FIELD: "FILEIDS", LABEL: "上传文档", COL: 24, CONTROLS: "ExUploadFile", ISREQUIRE: 0, ISSHOW: 1, OTHER: "", SLOTCFG: '.doc,.docx,.pdf', MAXLENGTH: '3' },
]
export const editFormConfig = [
    { FIELD: "PK_ORG", LABEL: "所属类别", COL: 24, CONTROLS: "ExSelectGroup", ISREQUIRE: 1, ISSHOW: 1, OTHER: "bd-knowledge-help/getTypeTreeList???TYPENAME=LABEL&TYPE=VALUE", LINKAGE: "{\"CLEAN\":\"PK_DEPT\"}", REVERFIELD: 'TYPENAME' },
    { FIELD: "FILETITLE", LABEL: "标题", COL: 24, CONTROLS: "ExTextBox", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "ESSFLAG", LABEL: "精华", COL: 12, CONTROLS: "ExSwitch", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "0", LINKAGE: "{\"CLEAN\":\"PK_ROLE\"}" },
    { FIELD: "TOPFLAG", LABEL: "置顶", COL: 12, CONTROLS: "ExSwitch", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', DEFAULTVAL: "0", LINKAGE: "{\"CLEAN\":\"PK_ROLE\"}" },
    { FIELD: "CONTENTS", LABEL: "内容", COL: 24, CONTROLS: "ExEditor", ISREQUIRE: 0, ISSHOW: 1, OTHER: '', LINKAGE: "{\"CLEAN\":\"PK_ROLE\"}" },
    { FIELD: "FILEIDS", LABEL: "上传文档", COL: 24, CONTROLS: "ExUploadFile", ISREQUIRE: 0, ISSHOW: 1, OTHER: "", SLOTCFG: '.doc,.docx,.pdf', MAXLENGTH: '3' },
]

export const TableConfig = [
    { FIELD: "FILENAME", LABEL: "名称", WIDTH: "300", ALIGN: "left", CONTROLS: "ExTextBox", ISSHOW: 1 },
    { FIELD: "SIZE", LABEL: "大小", WIDTH: "120", ALIGN: "right", VTYPE: "slot", ISSHOW: 1 },
    { FIELD: "CREATIONTIME", LABEL: "上传时间", WIDTH: "160", ALIGN: "center", CONTROLS: "ExTextBox", ISSHOW: 1 },
]