import request from '@/utils/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: 'sys/module/getTreeDetailList',
    method: 'post',
    data: query,
  })
}

// 查询菜单下按钮的数据
export function getBtnPages(query) {
  return request({
    url: 'sys/button/getList',
    method: 'post',
    data: query,
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/sys/module/add',
    method: 'post',
    data: data,
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/sys/module/update',
    method: 'post',
    data: data,
  })
}

// 删除菜单
export function delMenu(data) {
  return request({
    url: '/sys/module/deleteBatchIds',
    method: 'post',
    data: data,
  })
}

export function delBtn(data) {
  return request({
    url: 'sys/button/deleteBatchIds',
    method: 'post',
    data: data,
  })
}