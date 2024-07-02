import request from '@/utils/request'


export const totalDataText = [
    {
        label: '订单数',
        value: 'ORDERNUMS',
    },
    {
        label: '委托单',
        value: 'TASKNUMS',
    },
    {
        label: '派车单',
        value: 'SENDCARNUMS',
    },
    {
        label: '签收单',
        value: 'SIGNNUMS',
    },
    {
        label: '车次数',
        value: 'TRANSNUMS',
    },
]


export const realTimeTextList = [
    // {
    //     label: '订单数量',
    //     value: 'ORDERNUMS',
    //     rate: 'ORDERNUMSCOPE',
    //     // img: indexRight1
    // },

    {
        label: '派车数量',
        value: 'SIGNNUMS',
        rate: 'SENDCARNUMSCOPE',
    },
    // {
    //     label: '对账单数',
    //     value: 'ACCOUNTNUMS',
    //     rate: 'ACCOUNTNUMSCOPE',
    // },
    // {
    //     label: '结算数量',
    //     value: 'SETTLENUMS',
    //     rate: 'SETTLENUMSCOPE',
    // },
    {
        label: '签收单数',
        value: 'SIGNNUMS',
        rate: 'SIGNNUMSCOPE',
    },
]


export const truckingOrderTextList = [
    {
        label: '运输车辆',
        value: 'ORDERNUMS',
        rate: 'ORDERNUMSCOPE',
        // img: indexRight1
    },

    {
        label: '签收量',
        value: 'SENDCARNUMS',
        rate: 'SENDCARNUMSCOPE',
    },
    {
        label: '派车量',
        value: 'SETTLENUMS',
        rate: 'SETTLENUMSCOPE',
    },
    {
        label: '拉运量',
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
        // url: "/tms/screenDisplay/getNoticePageList",
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

//获取派车单
export function getKsDispatchData(data = {}) {
    return request({
        url: "/tms/screenDisplay/getKsDispatchData",
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