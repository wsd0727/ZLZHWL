import request from '@/utils/request'

/** 核算列表 */
export function getHSList(data) {
  return request({
    url: "/bms/receiptShip/getPageList",
    method: "post",
    data
  })
}


/** 同步运输任务  */
export function SyncYSRWAPI(data) {
  return request({
    url: "/bms/receiptShip/tbrq",
    method: "post",
    data
  })
}