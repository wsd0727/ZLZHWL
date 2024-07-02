import request from '@/utils/request'

// 查询库位图信息
export function getLocationData(data) {
  return request({
    url: 'stock/wmBa004/libraryBitmap',
    method: 'post',
    data
  })
}

// 查询库位详细信息
export function getLocationDetail(data) {
  return request({
    url: 'stock/wmBa004/getListByBillNo',
    method: 'post',
    data
  })
}