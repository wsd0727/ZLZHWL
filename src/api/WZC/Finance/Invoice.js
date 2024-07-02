import request from '@/utils/request'

/** 获取货主信息 */
export function getHZInfo(billno) {
  return request({
    url: "/sys/organize/getOrganizeById",
    method: "post",
    data: {
      BILLNO: billno,
      ISAES: "1"
    }
  })
}

/** 获取承运商信息 */
export function getCYSInfo(billno) {
  return request({
    url: "/base/bdcarrier/getCarrierAllDataById",
    method: "post",
    data: {
      BILLNO: billno,
      ISAES: "1"
    }
  })
}

/** 保存发票信息  */
export function saveInvoice(data) {
  return request({
    url: "/bms/invoice/saveInvoice",
    method: "post",
    data
  })
}

/** 结算单统计信息 */
export const YSConfig = [
  // { FIELD: "TRANSUM", LABEL: "运输总量", COL: 6, CONTROLS: "ExNumber", MAXLENGTH: "", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, ISDISABLED: "1", SUFFIX: "吨" },
  { FIELD: "AMOUNTAMT", LABEL: "运输总额", COL: 6, CONTROLS: "ExNumber", MAXLENGTH: "", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, ISDISABLED: "1", SUFFIX: "元" },
]
/** 货主信息配置  */
export const HZConfig = [
  { FIELD: "COMPANYNAME", LABEL: "货主", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
  { FIELD: "COMPANYIDENTICODE", LABEL: "纳税人识别号", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
  { FIELD: "COMPANYBANK", LABEL: "开户行", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "COMPANYACCOUNT", LABEL: "银行账号", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "COMPANYPHONE", LABEL: "电话", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "COMPANYADDR", LABEL: "地址", COL: 12, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
]


/** 承运商信息配置  */
export const CYSConfig = [
  { FIELD: "CARRIERNAME", LABEL: "承运商", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
  { FIELD: "CARRIERIDENTICODE", LABEL: "纳税人识别号", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
  { FIELD: "CARRIERBANK", LABEL: "开户行", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "CARRIERACCOUNT", LABEL: "银行账号", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "CARRIERPHONE", LABEL: "电话", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "CARRIERADDR", LABEL: "地址", COL: 12, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
]

/** 承运商信息配置  */
export const ZLCYSConfig = [
  { FIELD: "CARRIERNAME", LABEL: "承运商", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 1, },
  { FIELD: "CARRIERIDENTICODE", LABEL: "纳税人识别号", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "CARRIERBANK", LABEL: "开户行", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "CARRIERACCOUNT", LABEL: "银行账号", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "CARRIERPHONE", LABEL: "电话", COL: 6, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
  { FIELD: "CARRIERADDR", LABEL: "地址", COL: 12, CONTROLS: "ExReadCard", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
]

/** 发票登记配置  */
export const FPConfig = [
  { FIELD: "TOTALSUM", LABEL: "发票金额", COL: 6, CONTROLS: "ExNumber", MAXLENGTH: "", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, ISDISABLED: "1", SUFFIX: "元" },
  { FIELD: "VMEMO", LABEL: "备注", COL: 18, CONTROLS: "ExTextBox", MAXLENGTH: "200", ISSHOW: 1, OTHER: "", ISREQUIRE: 0, },
]