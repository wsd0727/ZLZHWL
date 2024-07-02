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
//周报新增
export function SSweekAdd(data) {
    return request({
        url: 'bd-daily-and-weekly/addDaily',
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

//抄送人员默认回显
export function getUserList(data) {
    return request({
        url: 'ba-role-cc-setting/selectCc',
        method: 'post',
        data
    })
}
// 用户表单配置
export const WeekFormConfig = [
    { FIELD: "COMPLETEWORK", LABEL: "本周完成工作", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "WORKSUMMARY", LABEL: "本周工作总结", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, OTHER: "" },
    { FIELD: "PLANWORK", LABEL: "下周工作计划", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "NEEDHELP", LABEL: "需协调与帮助", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, OTHER: "" ,MAXLENGTH:'2000' },
    { FIELD: "VMEMO", LABEL: "备注", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, OTHER: "",MAXLENGTH:'400' },
    { FIELD: "IMGLIST", LABEL: "上传图片", COL: 24, CONTROLS: "ExUpload", ISREQUIRE: 0, ISSHOW: 1, OTHER: "/sys/file/upload", SLOTCFG: '', MAXLENGTH: '3' },
    { FIELD: "FILELIST", LABEL: "附件", COL: 24, CONTROLS: "ExUploadFile", ISREQUIRE: 0, ISSHOW: 1, OTHER: "", SLOTCFG: '.doc,.docx,.pdf', MAXLENGTH: '3' },
    { FIELD: "READERIDLIST", LABEL: "抄送人员", COL: 24, CONTROLS: "slot", ISREQUIRE: 1, ISSHOW: 1, OTHER: "sys/user/getTreeList???TYPENAME=LABEL&TYPE=VALUE", LINKAGE: "", REVERFIELD: 'TYPENAME' },
    // { FIELD: "READERIDLIST", LABEL: "抄送人员", COL: 24, CONTROLS: "ExSelectMutiple", ISREQUIRE: 1, ISSHOW: 1, OTHER: "sys/user/getTreeList???TYPENAME=LABEL&TYPE=VALUE", LINKAGE: "", REVERFIELD: 'TYPENAME' },
]
export const FormConfig = [
    { FIELD: "COMPLETEWORK", LABEL: "今日完成工作", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "WORKSUMMARY", LABEL: "未完成工作", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, OTHER: "" },
    { FIELD: "PLANWORK", LABEL: "明日工作计划", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "NEEDHELP", LABEL: "需协调与帮助", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, OTHER: "",MAXLENGTH:'2000' },
    { FIELD: "VMEMO", LABEL: "备注", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, OTHER: "",MAXLENGTH:'400' },
    { FIELD: "IMGLIST", LABEL: "上传图片", COL: 24, CONTROLS: "ExUpload", ISREQUIRE: 0, ISSHOW: 1, OTHER: "/sys/file/upload", SLOTCFG: '', MAXLENGTH: '3' },
    { FIELD: "FILELIST", LABEL: "附件", COL: 24, CONTROLS: "ExUploadFile", ISREQUIRE: 0, ISSHOW: 1, OTHER: "", SLOTCFG: '.doc,.docx,.pdf', MAXLENGTH: '3' },
    { FIELD: "READERIDLIST", LABEL: "抄送人员", COL: 24, CONTROLS: "slot", ISREQUIRE: 1, ISSHOW: 1, OTHER: "sys/user/getTreeList???TYPENAME=LABEL&TYPE=VALUE", LINKAGE: "", REVERFIELD: 'TYPENAME' },
] 
// 用户表单配置
export const SSFormConfig = [
    { FIELD: "VNAME", LABEL: "项目名称", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 1, ISSHOW: 1, OTHER: "",MAXLENGTH:'50' },
    { FIELD: "PLANONLINEDATE", LABEL: "上线日期", COL: 24, CONTROLS: "ExDate", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "COMPLETEWORK", LABEL: "今日完成工作", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "WORKSUMMARY", LABEL: "未完成工作", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 1, OTHER: "" },
    { FIELD: "PLANWORK", LABEL: "明日工作计划", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 1, ISSHOW: 1, OTHER: "" },
    { FIELD: "NEEDHELP", LABEL: "需协调与帮助", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 1, ISSHOW: 1, OTHER: "",MAXLENGTH:'2000' },
    { FIELD: "VMEMO", LABEL: "备注", COL: 24, CONTROLS: "ExTextarea", ISREQUIRE: 0, ISSHOW: 0, OTHER: "",MAXLENGTH:'400' },
    { FIELD: "IMGLIST", LABEL: "上传图片", COL: 24, CONTROLS: "ExUpload", ISREQUIRE: 0, ISSHOW: 1, OTHER: "/sys/file/upload", SLOTCFG: '', MAXLENGTH: '3' },
    { FIELD: "FILELIST", LABEL: "附件", COL: 24, CONTROLS: "ExUploadFile", ISREQUIRE: 0, ISSHOW: 1, OTHER: "", SLOTCFG: '.doc,.docx,.pdf', MAXLENGTH: '3' },
    { FIELD: "READERIDLIST", LABEL: "抄送人员", COL: 24, CONTROLS: "slot", ISREQUIRE: 1, ISSHOW: 1, OTHER: "sys/user/getTreeList???TYPENAME=LABEL&TYPE=VALUE", LINKAGE: "", REVERFIELD: 'TYPENAME' },
] 