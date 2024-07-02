import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/sys/module/getMenuByRoleList',
    method: 'post',
    data: {
      BILLFROM: "0"
    }
  })
}