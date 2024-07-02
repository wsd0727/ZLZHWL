import request from '@/utils/request'


export const totalDataText = [
    // {
    //     label: '委托量',
    //     value: 'TASKAMOUNT',
    //     // rate: 'TOTALMONEYRATE',
    //     // img: indexRight1
    // },
    {
        label: '任务单',
        value: 'SENDCARAMOUNT',
    },
    {
        label: '拉运次数',
        value: 'TRANSNUMS',
    },
    {
        label: '对账单',
        value: 'ACCOUNTNUMS',
    },
    {
        label: '结算单',
        value: 'SEETLETNUMS',
    },
    {
        label: '司机数',
        value: 'ASSIGNDRIVERNUMS',
    },
    // {
    //     label: '承运商',
    //     value: 'CARRIERNUMS',
    // },
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
    // {
    //     value: 'YEAR',
    //     label: '年数据'
    // },
]

export const transportVTYPEList = [
    {
        value: 'DAY',
        label: '日数据'
    },
    {
        value: 'MONTH',
        label: '月数据'
    },
    // {
    //     value: 'YEAR',
    //     label: '年数据'
    // },
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


export const tableHeaderStyle = {
    backgroundColor: "#EDF4FE",
    fontSize: '15px',
    fontWeight: 500,
    color: '#1B1B1B',
}

export const commissionText = [
    {
        label: '委托代办',
        num: 10,
        addNum: 2
    },
    {
        label: '运输代办',
        num: 10,
        addNum: 2
    },
    {
        label: '对账代办',
        num: 10,
        addNum: 2
    },
    {
        label: '结算代办',
        num: 10,
        addNum: 2
    },
    {
        label: '付款代办',
        num: 10,
        addNum: 2
    },
    // {
    //     label: '其他代办',
    //     num: 10,
    //     addNum: 2
    // },
]


// 获取总数据
export function getTotalData() {
    return request({
        url: "tms/screenDisplay/getTotalData",
        method: "post",
        data: {}
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

//获取超时数据
export function getTimedOutTask() {
    return request({
        url: "tms/screenDisplay/getTimedOutTask",
        method: "post",
        data: {}
    })
}

//获取运输统计
export function getTransportData(data = {}) {
    return request({
        url: "/tms/screenDisplay/getTransportData",
        method: "post",
        data: data
    })
}
//获取代办事项
export function getTodoList(data = {}) {
    return request({
        url: "tms/screenDisplay/getTodoList",
        method: "post",
        data: data
    })
}




