import request from '@/utils/request'
import { method } from 'lodash-es'

// 基地
export function getORG() {
  return request({
    url: "/bms/bmsBoard/boardGroupList",
    method: "post",
    data: {}
  })
}

// 物料
export function getWL() {
  return request({
    url: "/bms/bmsBoard/projectClassInfo",
    method: "post",
    data: {}
  })
}

// 片区
export function getAreaData(data) {
  return request({
    url: "/base/bd-area/getTreeList",
    method: "post",
    data
  })
}

// 发货量
export function CpzFHL(data) {
  return request({
    url: "/bms/bmsBoard/areaOrderNum",
    method: "post",
    data
  })
}

// 营收指标
export function CpzYSZB(data) {
  return request({
    url: "/bms/bmsBoard/revenueIndicators",
    method: "post",
    data
  })
}

// 费用
export function CpzFYPie(data) {
  return request({
    url: "/bms/bmsBoard/cost",
    method: "post",
    data
  })
}
export function CpzFYLine(data) {
  return request({
    url: "/bms/bmsBoard/costBum",
    method: "post",
    data
  })
}

// 净利率
export function CpzJLR(data) {
  return request({
    url: "/bms/bmsBoard/netProfitMargin",
    method: "post",
    data
  })
}