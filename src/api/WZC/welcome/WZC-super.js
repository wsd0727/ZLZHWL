import request from '@/utils/request'


export const totalDataText = [
    // {
    //     label: '委托量',
    //     value: 'TASKAMOUNT',
    //     // rate: 'TOTALMONEYRATE',
    //     // img: indexRight1
    // },
    {
        label: '派车量（吨）',
        value: 'SENDCARAMOUNT',
    },
    {
        label: '签收量（吨）',
        value: 'SIGNAMOUNT',
    },
    {
        label: '结算量（吨）',
        value: 'SETTLEAMOUNT',
    },
    {
        label: '车辆数（个）',
        value: 'VEHICLENUMS',
    },
    {
        label: '司机数（个）',
        value: 'DRIVERNUMS',
    },
    {
        label: '承运商（个）',
        value: 'CARRIERNUMS',
    },
]



export const realTimeVTYPEList = [
    {
        value: 'DAY',
        label: '日数据'
    },
    {
        value: 'MONTH',
        label: '月数据'
    },
    {
        value: 'YEAR',
        label: '年数据'
    },
]

export const realTimeTextList = [
    {
        label: '订单数量',
        value: 'ORDERNUMS',
        rate: 'ORDERNUMSCOPE',
        // img: indexRight1
    },

    {
        label: '派车数量',
        value: 'SENDCARNUMS',
        rate: 'SENDCARNUMSCOPE',
    },
    {
        label: '对账单数',
        value: 'ACCOUNTNUMS',
        rate: 'ACCOUNTNUMSCOPE',
    },
    {
        label: '结算数量',
        value: 'SETTLENUMS',
        rate: 'SETTLENUMSCOPE',
    },
]


// 获取总数据
export function getTotalData() {
    return request({
        url: "tms/screenDisplay/getTotalData",
        method: "post",
        data: {}
    })
}

// 获取实时数据
export function getRealTimeData(data) {
    return request({
        url: "/tms/screenDisplay/getRealTimeData",
        method: "post",
        data
    })
}

//获取公告
export function getNotice(data = {}) {
    return request({
        url: "/sys/notice/getSysMessage",
        method: "post",
        data: data
    })
}
// 获取预警
export function getWarningData(data = {}) {
    return request({
        url: "/tms/screenDisplay/getWarningData",
        method: "post",
        data
    })
}
//获取客商企业分布
export function getCustSpreadData(data = {}) {
    return request({
        url: "/tms/screenDisplay/getCustSpreadData",
        method: "post",
        data
    })
}

//获取路线
export function getLineRankData(data = {}) {
    return request({
        url: "/tms/screenDisplay/getLineRankData",
        method: "post",
        data
    })
}
//获取物料
export function getMaterialStatData(data = {}) {
    return request({
        url: "/tms/screenDisplay/getMaterialStatData",
        method: "post",
        data
    })
}
//获取派车情况
export function getDispatchStatData(data = {}) {
    return request({
        url: "/tms/screenDisplay/getDispatchStatData",
        method: "post",
        data
    })
}

//获取物料列表
export function getSelectMaterials(data = {}) {
    return request({
        url: "/base/material/getSelectMaterials",
        method: "post",
        data
    })
}



// // 保存用户主题配置
// export function saveUserConfig(data) {
//   return request({
//     url: "/sys/sysUserConfig/add",
//     method: "post",
//     data
//   })
// }

// // 保存软件注册
// export function saveSoftware(data) {
//   return request({
//     url: "/sys/custlicense/update",
//     method: "post",
//     data
//   })
// }

// // 设置快捷入口
// export function setMyStart(data){
//   return request({
//     url: data.url ,
//     method: "post",
//     data: data.data
//   })
// }

// export function queryMenu(data){
//   return request({
//     // url: '/module/getModuleTree' ,
//     url: '/sys/module/getSimpleMenuByRoleList' ,
//     method: "post",
//     data
//   })
// }

// // 获取顶部通知
// export function queryNotice(data){
//   return request({
//     url: "message/notification/getList" ,
//     method: "post",
//     data: data
//   })
// }


// // 获取角色列表
// export function getRole(){
//   return request({
//     url: "/sys/userType/getList" ,
//     method: "post",
//     data: {}
//   })
// }

// export function setRole(data){
//   return request({
//     url: "/auth/check/changeUser" ,
//     method: "post",
//     data: data
//   })
// }