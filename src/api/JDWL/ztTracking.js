import request from '@/utils/request'

//查询快捷入口接口
export function getTreeData(data) {
  return request({
    url: '/tms/tranorder/getRouteTruck',
    method: 'post',
    data
  })
}

// 查询车辆轨迹
export function getPath(data) {
  return request({
    url: "/tms/gps/getGPSList",
    method: "post",
    data
  })
}