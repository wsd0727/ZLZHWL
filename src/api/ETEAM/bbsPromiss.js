/**
 *  协同 知识库 授权 
 * @piplns 2023-03-24
 */
import request from '@/utils/request'

// 角色 知识库权限
export function editRoleBBS(data) {
  return request({
    url: "/ba-role-sys-knowledge-help/add",
    method: "post",
    data
  })
}

export const RoleBBSFormConfig = [
  { FIELD: "VNAME", LABEL: "名称", COL: 24, CONTROLS: "ExReadCard", ISREQUIRE: 1, ISSHOW: 1 },
  { FIELD: "VCODE", LABEL: "编码", COL: 24, CONTROLS: "ExReadCard", ISREQUIRE: 1, ISSHOW: 1 },
  { FIELD: "CLASSLIST", LABEL: "知识库权限", COL: 24, CONTROLS: "slot", ISSHOW: 1 }
]

// 用户 知识库权限
export function getUserBBS(data) {
  return request({
    url: "/ba-user-knowledge-help/getDetail",
    method: "post",
    data
  })
}

export function editUserBBS(data) {
  return request({
    url: "/ba-user-knowledge-help/add",
    method: "post",
    data
  })
}

export const UserBBSFormConfig = [
  { FIELD: "VNAME", LABEL: "用户", COL: 24, CONTROLS: "ExReadCard", ISREQUIRE: 1, ISSHOW: 1 },
  { FIELD: "ROLENAME", LABEL: "角色", COL: 24, CONTROLS: "ExReadCard", ISREQUIRE: 1, ISSHOW: 1 },
  { FIELD: "CLASSLIST", LABEL: "知识库权限", COL: 24, CONTROLS: "slot", ISSHOW: 1 }
]
