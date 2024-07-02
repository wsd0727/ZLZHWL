import request from '@/utils/request'

// 文件上传
export const fileUploadApi = "/sys/file/upload"


// 获取用户主题配置
export function getUserConfig() {
  return request({
    url: "/sys/sysUserConfig/getInfo",
    method: "post",
    data: {}
  })
}
// 保存用户主题配置
export function saveUserConfig(data) {
  return request({
    url: "/sys/sysUserConfig/add",
    method: "post",
    data
  })
}

// 保存软件注册
export function saveSoftware(data) {
  return request({
    url: "/sys/custlicense/update",
    method: "post",
    data
  })
}

// 设置快捷入口
export function setMyStart(data) {
  return request({
    url: data.url,
    method: "post",
    data: data.data
  })
}

export function queryMenu(data) {
  return request({
    // url: '/module/getModuleTree' ,
    url: '/sys/module/getSimpleMenuByRoleList',
    method: "post",
    data
  })
}

// 获取顶部通知
export function queryNotice(data) {
  return request({
    url: "sys/messageNotification/querySysMessage",
    method: "post",
    data: data
  })
}

// 获取通知列表数据
export function queryNoticeByUrl(url, data) {
  return request({
    url: url,
    method: "post",
    data: data
  })
}


// 获取顶部通知数量
export function queryUnRead(data) {
  return request({
    url: "sys/messageRecord/app/getNoReadCount",
    method: "post",
    data: data
  })
}


// 获取角色列表
export function getRole() {
  return request({
    url: "/sys/userType/getList",
    method: "post",
    data: {}
  })
}

export function setRole(data) {
  return request({
    url: "/auth/check/changeUser",
    method: "post",
    data: data
  })
}

// 获取脱敏信息
export function getDesInfo(data) {
  return request({
    url: "/sys/decryptSqlInfo/queryAndDecryptColumn",
    method: "post",
    data,
    encry: false
  })
}