<template>
    <div class="workbench">
        <div class="disgrid left2right1">
            <div>
                <div class="commonCard totalData">
                    <div class="commonCard-separate">
                        <div class="commonCard-oneLine">
                            <div class="commonCard-titleBlock"></div>
                            <div class="commonCard-titleText">总数据</div>
                        </div>
                    </div>
                    <div class="totalData-top">
                        <div v-for="(item, index) in totalDataText" :key="index">
                            <div class="totalData-top-num">{{ totalData[item.value] || 0 }}</div>
                            <div class="commonCard-commonText">{{ item.label }}</div>
                        </div>
                    </div>
                    <div class="totalData-bottom">
                        <div class="totalData-graph">
                            <div class="">
                                <div class="commonCard-commonText">{{autoUnitVal(totalData.ORDERAMOUNT,{value:totalData.ORDERAMOUNT,label:'订单总量(吨）'}).label}}</div>
                                <div class="totalData-bottom-num">{{autoUnitVal(totalData.ORDERAMOUNT,{value:totalData.ORDERAMOUNT,label:'订单总量(吨）'}).value}}</div>
                                <div class="totalData-bottom-title disflex">
                                    <div>较去年</div>
                                    <img v-if="totalData.ORDERAMOUNTRATE && totalData.ORDERAMOUNTRATE.includes('-')" class="arrowsImg"
                                        src="@/assets/images/WZC/arrowsDown.png" alt="">
                                    <img v-else src="@/assets/images/WZC/arrowsUp.png" alt="" class="arrowsImg">
                                    <div>{{ totalData.ORDERAMOUNTRATE || 0 }}</div>
                                </div>
                            </div>
                            <div id="totalFreight" style="width: 100%;height: 120px;"></div>
                        </div>
                        <div class="totalData-graph">
                            <div>
                                <div class="commonCard-commonText">{{autoUnitVal(totalData.SIGNAMOUNT,{value:totalData.SIGNAMOUNT,label:'签收总量（吨）'}).label}}</div>
                                <div class="totalData-bottom-num">{{autoUnitVal(totalData.SIGNAMOUNT,{value:totalData.SIGNAMOUNT,label:'签收总量（吨）'}).value}}</div>
                               
                                <div class="totalData-bottom-title disflex">
                                    <div>较去年</div>
                                    <img v-if="totalData.SIGNAMOUNTRATE && totalData.SIGNAMOUNTRATE.includes('-')" class="arrowsImg"
                                        src="@/assets/images/WZC/arrowsDown.png" alt="">
                                    <img v-else src="@/assets/images/WZC/arrowsUp.png" alt="" class="arrowsImg">
                                    <div>{{ totalData.SIGNAMOUNTRATE || 0 }}</div>
                                </div>
                            </div>
                            <div id="HWBNumber" style="width: 100%;height: 120px;"></div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="commonCard">
                <div class="notic" v-if="userInfo.ACCOUNTTYPE != 2">
                    <div class="disflex justify-sb">
                        <div class="commonCard-oneLine">
                            <div class="commonCard-titleBlock"></div>
                            <div class="commonCard-titleText">通知公告</div>
                        </div>
                    </div>
                    <div v-for="(item, index) in  noticList " :key="index" class="disflex notic-rowline"
                        :class="item.isRead == 0 ? 'isRead' : ''">
                        <div class="notic-label">{{ item.TITLE }}</div>
                        <div class="notic-time">{{ item.PUBLISHTIME }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="disgrid left1right1">
            <div>
                <div class="commonCard realTime">
                    <div class="commonCard-separate">
                        <div class="commonCard-oneLine">
                            <div class="commonCard-titleBlock"></div>
                            <div class="disflex">
                                <div class="commonCard-titleText">实时数据</div>
                                <div class="realTime-hint disflex">
                                    <img src="@/assets/images/WZC/laba.png" class="realTime-img mr5" alt="">
                                    <div class="mr5">今日新增订单</div>
                                    <div class="realTime-blueText"> {{ realTimeData.TDYSIGNNUMSCOPE }}单 </div>
                                    <div class="realTime-blueText cp" @click="gotoOrder"> 请前去查看</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="realTime-bottom">
                        <div>
                            <div class="commonCard-commonText mb5 disflex ">
                                <div class="mr5">签收总量</div>
                                <div class="realTime-colorLump" :class="{ 'active': realTimeData.SIGNANUMSRATE >= '20%' }">
                                </div>
                                <div class="realTime-colorLump" :class="{ 'active': realTimeData.SIGNANUMSRATE >= '40%' }">
                                </div>
                                <div class="realTime-colorLump" :class="{ 'active': realTimeData.SIGNANUMSRATE >= '60%' }">
                                </div>
                                <div class="realTime-colorLump" :class="{ 'active': realTimeData.SIGNANUMSRATE >= '80%' }">
                                </div>
                                <div class="realTime-colorLump" :class="{ 'active': realTimeData.SIGNANUMSRATE == '100%' }">
                                </div>
                            </div>
                            <div class="totalData-bottom-num textFF9900"> {{ realTimeData.SIGNAMOUNT }}<span
                                    class="totalData-bottom-title">万吨</span> </div>
                            <div class="totalData-bottom-title disflex">
                                当前签收达成
                                <div class="textFF9900">{{ realTimeData.SIGNANUMSRATE }}</div>
                            </div>
                        </div>
                        <div v-for="item in realTimeTextList" :key="item.value">
                            <div class="commonCard-commonText mb5">{{ item.label }}</div>
                            <div class="totalData-bottom-num">{{ realTimeData[item.value] }} <span
                                    class="totalData-bottom-title">单</span> </div>
                            <div class="totalData-bottom-title disflex">
                                <div>较昨日</div>
                                <img v-if="realTimeData[item.rate] <= 0" class="arrowsImg"
                                    src="@/assets/images/WZC/arrowsDown.png" alt="">
                                <img v-else src="@/assets/images/WZC/arrowsUp.png" class="arrowsImg" alt="">
                                <div>{{ realTimeData[item.rate] }}单</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="commonCard truckingOrder">
                    <div class="commonCard-separate">
                        <div class="commonCard-oneLine">
                            <div class="commonCard-titleBlock"></div>
                            <div class="commonCard-titleText">派车单统计</div>
                        </div>
                    </div>
                    <div class="truckingOrder-main">
                        <div v-for="item in truckingOrderTextList" :key="item.value">
                            <div class="commonCard-commonText mb5">{{ item.label }}</div>
                            <div class="totalData-bottom-num">{{ realTimeData[item.value] }} <span
                                    class="totalData-bottom-title">单</span> </div>
                            <div class="totalData-bottom-title disflex">
                                <div>较昨日</div>
                                <img v-if="realTimeData[item.rate] <= 0" class="arrowsImg"
                                    src="@/assets/images/WZC/arrowsDown.png" alt="">
                                <img v-else src="@/assets/images/WZC/arrowsUp.png" class="arrowsImg" alt="">
                                <div>{{ realTimeData[item.rate] }}单</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="commonCard">
                <div class="firstAid">
                    <div class="firstAid-header">
                        <div class="firstAid-header-title">预警中心</div>
                        <div class="divideMiddle4 firstAid-header-text mt10">
                            <div>预警类型</div>
                            <div>运单号</div>
                            <div>车牌号</div>
                            <div>处理</div>
                            <div>操作</div>
                        </div>
                    </div>
                    <div class="firstAid-main" id="scrollData" ref="scrollData">
                        <el-carousel trigger="click" height="250" direction="vertical" :interval="5000">
                            <el-carousel-item v-for="(items, indexs) in warningData.dividePENDLIST" :key="index">
                                <div class="divideMiddle4 text-c font500 f13" v-for=" item  in  items " :key="item.CARNO">
                                    <div class="textFF3000 ">
                                        {{ selectDictLabel(yjlx, item.VTYPE) }}
                                    </div>
                                    <div>{{ item.TRANORDER }}</div>
                                    <div>{{ item.CARNO }}</div>
                                    <div class="textFF3000">{{ selectDictLabel(yjshzt, item.BILLSTATUS) }}</div>
                                    <div class="textFF3000 cp" @click="gotoWarning">详情</div>
                                </div>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
            </div>




        </div>






    </div>
</template>
  
<script setup name="">
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";

import * as echarts from "echarts";
import China from "@/assets/map/china.json"
let myEcharts = echarts;
const { proxy } = getCurrentInstance();
const router = useRouter();
const avatarUrl = ref();
import { onMounted, onUnmounted, ref } from "vue";
import useUserStore from "@/store/modules/user";
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

import { getTotalData, totalDataText, getRealTimeData, realTimeTextList, getWarningData, getNotice, truckingOrderTextList, getKsDispatchData } from "#/WZC/welcome/WZC-travelling.js";
const { yjlx, yjshzt } = proxy.useDict("yjlx", "yjshzt")
const currentDate = ref('')
const lastMonthDate = ref('')


onMounted(() => {
    let nowDate = new Date()
    
    if (nowDate.getMonth() == 0) {
        currentDate.value = nowDate.getFullYear() + '-' + "01" + '-' + (nowDate.getDate() >= 10 ? nowDate.getDate() : "0" + nowDate.getDate())
        lastMonthDate.value = (nowDate.getFullYear() - 1) + '-' + "12" + '-' + (nowDate.getDate() >= 10 ? nowDate.getDate() : "0" + nowDate.getDate())
    } else {
        currentDate.value = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1 >= 10 ? nowDate.getMonth() + 1 : "0" + (nowDate.getMonth() + 1)) + '-' + (nowDate.getDate() >= 10 ? nowDate.getDate() : "0" + nowDate.getDate())
        lastMonthDate.value = nowDate.getFullYear() + '-' + (nowDate.getMonth() >= 10 ? nowDate.getMonth() : "0" + nowDate.getMonth()) + '-' + (nowDate.getDate() >= 10 ? nowDate.getDate() : "0" + nowDate.getDate())
    }


    GetTotalData()
    GetRealTimeData()
    GetWarningData()

    GetNotice()

    getgetKsDispatchData()


});
const autoUnitVal = (val,config) => {
    if(val > 9999.999){
        return {
            value:((val/1000)/10).toFixed(2),
            label:config.label.includes('吨')?config.label.replace("吨","万吨"):config.label.includes('个')?config.label.replace("个","万个"):config.label
        }
    }else{
        return {
            value:val,
            label:config.label
        }
    }

}


//货主公告页面
const noticList = ref([])
const GetNotice = () => {
    let data = {
        MODULEID: "MU221012772756",
        PAGEID: "PG221012151975",
        PAGENUM: 1,
        PAGESIZE: 7
    }
    getNotice(data).then((res) => {
        noticList.value = res.RESULT.RECORDS
    });
}

const totalData = ref({})
function GetTotalData() {
    getTotalData({}).then((res) => {
        totalData.value = res.RESULT
        let drawTotalFreightNumArr = []
        let drawTotalFreightDateArr = []
        totalData.value.ORDERAMOUNTTREND.forEach(ele => {
            drawTotalFreightNumArr.push(ele.NUM)
            drawTotalFreightDateArr.push(ele.CREATEDATE)
        })

        drawTotalFreight(drawTotalFreightNumArr, drawTotalFreightDateArr)

        let drawHWBNumberNumArr = []
        let drawHWBNumberDateArr = []
        totalData.value.SIGNAMOUNTREND.forEach(ele => {
            drawHWBNumberNumArr.push(ele.NUM)
            drawHWBNumberDateArr.push(ele.CREATEDATE)
        })

        drawHWBNumber(drawHWBNumberNumArr, drawHWBNumberDateArr)


    });
}
const realTimeVTYPE = ref('DAY')
const realTimeData = ref({})
function GetRealTimeData() {
    getRealTimeData({
        VTYPE: realTimeVTYPE.value
    }).then((res) => {
        realTimeData.value = res.RESULT
    });
}
const warningData = ref({
    PENDLIST: []
})
function GetWarningData() {
    getWarningData().then((res) => {
        warningData.value = res.RESULT


        warningData.value.dividePENDLIST = []
        warningData.value.dividePENDLIST = warningData.value.PENDLIST.reduce((acc, curr, index) => {
            if (index % 5 === 0) acc.push([])
            acc[Math.floor(index / 5)].push(curr)
            return acc
        }, [])


    });
}

const gotoOrder = () => {
    router.push('/oms/tsOrder')
}
const gotoWarning = () => {
    router.push('/tms/warninfo')
}


const drawTotalFreight = (numArr, dateArr) => {
    let chart = myEcharts.init(document.getElementById("totalFreight"), "purple-passion");
    chart.setOption({
        // color: ['#EAE7FF'],
        // axisLine:'#EAE7FF',
        tooltip: {
            trigger: 'axis',
            // formatter: function (data) {
            //     console.log(data)
            //     // return data.marker + data.data.label + ': ' + data.value + '<br/>';
            // },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dateArr
        },
        yAxis: {
            show: false,
            type: 'value'
        },
        series: [
            {
                data: numArr,
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 1,//外边线宽度
                    color: '#254EFF'//外边线颜色
                },
                areaStyle: {//区域填充渐变颜色
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#EAE7FF' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#EAE7FF' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            }
        ]
    });
    // 大小自适应窗口大小变化
    window.onresize = function () {
        // 重置容器高宽
        chart.resize();
    };
}
const drawHWBNumber = (numArr, dateArr) => {
    let chart = myEcharts.init(document.getElementById("HWBNumber"), "purple-passion");
    chart.setOption({
        color: ['#67D3AF'],
        tooltip: {
            trigger: 'axis',
            // formatter: function (data) {
            //     console.log(data)
            //     // return data.marker + data.data.label + ': ' + data.value + '<br/>';
            // },
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dateArr
        },
        yAxis: {
            show: false,
            type: 'value'
        },
        // grid: {
        //     // left: '3%',
        //     // right: '4%',
        //     // bottom: '3%',
        //     containLabel: true
        // },
        series: [
            {
                data: numArr,
                type: 'line',
                smooth: true,
                showSymbol: false,
                // lineStyle: {
                //     width: 1,//外边线宽度
                //     color: '#254EFF'//外边线颜色
                // },
                lineStyle: {
                    width: 1,//外边线宽度
                    color: '#67D3AF'//外边线颜色
                },
                areaStyle: {//区域填充渐变颜色
                    color: {
                        // type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#F1FFFA' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#DFFFF4' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            }
        ]
    });
    // 大小自适应窗口大小变化
    window.onresize = function () {
        // 重置容器高宽
        chart.resize();
    };
}


const getgetKsDispatchData = () => {
    getKsDispatchData().then((res) => {





    });




}







</script>
  
<style scoped lang="scss">
.welcome-img {
    max-width: 100%;
}

.disflex {
    display: flex;
    align-items: center;
}

.align-s {
    align-items: start;
}

.justify-sb {
    justify-content: space-between;
}

.mb-10 {
    margin-bottom: 20px;
}

.mb-20 {
    margin-bottom: 20px;
}

.textFF3000 {
    color: #FF3000;
}

.text272727 {
    color: #272727;
}

.textFF9900 {
    color: #FF9900 !important;
}

.font500 {
    font-weight: 500;
}

.f13 {
    font-size: 13px;

}

.f15 {
    font-size: 15px;
}

.arrowsImg {
    width: 10px;
    margin: 0 3px;
}

.workbench {
    margin-top: 10px;

    .commonCard {
        background-color: #fff;
        padding: 14px;

        &-separate {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &-oneLine {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }

        &-titleText {
            font-size: 18px;
            font-weight: bold;
            color: #272727;
        }

        &-titleBlock {
            width: 5px;
            height: 18px;
            background: #1964F8;
            border-radius: 3px;
            margin-right: 5px;
        }

        &-gray {
            color: #7A7A7A;
            font-size: 15px;
            font-weight: 500;
        }

        &-commonText {
            font-size: 15px;
            font-weight: 500;
            color: rgba(39, 39, 39, 0.6);
            margin-bottom: 10px;
        }
    }

    .left2right1 {
        display: grid;
        grid-template-columns: calc(65% - 10px) calc(35% - 10px);
        grid-column-gap: 10px;
        margin-bottom: 10px;

    }

    .left1right1 {
        display: grid;
        grid-template-columns: repeat(2, calc(50% - 10px));
        grid-column-gap: 10px;
    }

    .divideMiddle4 {
        display: grid;
        // grid-template-columns: repeat(4, 25%);
        grid-template-columns: repeat(5, 20%);
        //   grid-column-gap: 10px;
    }

    .totalData {
        &-top {
            display: grid;
            grid-template-columns: repeat(5, calc(20% - 10px));
            // grid-template-rows: 100px 100px 100px;
            // grid-row-gap: 20px;
            grid-column-gap: 10px;
            text-align: center;
            margin-bottom: 10px;

            //   &-title{
            //     font-size: 16px;
            //     font-weight: 500;
            //     color: rgba(39, 39, 39, 0.59);
            //   }
            &-num {
                font-size: 22px;
                font-weight: 800;
                color: #272727;
                margin-bottom: 10px;
            }
        }

        &-bottom {
            display: grid;
            grid-template-columns: repeat(2, calc(50% - 10px));
            grid-column-gap: 10px;
            margin-top: 20px;

            &-title {
                font-size: 12px;
                font-weight: 500;
                color: rgba(39, 39, 39, 0.59);
                margin-top: 10px;
                margin-bottom: 10px;
            }

            &-num {
                font-size: 35px;
                font-weight: 800;
                color: #272727;
            }

        }

        &-graph {
            display: grid;
            grid-template-columns: 35% 65%;
            // grid-column-gap: 10px;
            align-items: center;
            justify-items: center;
        }
    }

    .realTime {
        &-hint {
            padding: 0 10px;
            height: 40px;
            background: #F3F7FE;
            border-radius: 6px;

            font-size: 13px;
            font-weight: 500;
            color: #02071A;
            line-height: 44px;
            // margin-bottom: 20px;
            margin-left: 20px;
        }

        &-blueText {
            color: #1964F8;
            margin-right: 10px;
        }

        &-bottom {
            margin-top: 10px;
            display: grid;
            grid-template-columns: calc(40% - 10px) repeat(2, calc(30% - 10px));
            grid-column-gap: 10px;
        }

        &-img {
            width: 18px;
        }

        &-tabBtn {
            font-size: 15px;
            font-weight: 500;
            color: #262728;

            &.active {
                color: #1964F8;
            }
        }

        &-colorLump {
            width: 16px;
            height: 16px;
            background: #D7D7D7;
            border-radius: 2px;
            margin-right: 1px;

            &.active {
                background-color: #FF9900;
            }
        }
    }

    .firstAid {
        border: 1px solid #E42B2B;
        opacity: 0.65;
        border-radius: 7px;
        overflow: hidden;

        &-header {
            padding: 10px;
            // background: linear-gradient(to bottom, #FFEDED, #FBF8FB);
            background: linear-gradient(to bottom, #FFEDED, #FBF8FB);

            &-title {
                font-size: 17px;
                font-weight: bold;
                color: #FF5656;
            }

            &-text {
                text-align: center;
                font-size: 13px;
                font-weight: 500;
                color: #161617;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(255, 86, 86, 0.3);
            }
        }

        &-main {
            background-color: #FAFBFF;
            padding-bottom: 10px;
            // height: 100px;
            height: 260px;
            // overflow-y: auto;
        }
    }

    .plantWarning {
        &-top {
            display: grid;
            grid-template-columns: repeat(2, calc(50% - 10px));
            grid-column-gap: 10px;
        }

        &-num {
            font-size: 30px;
            font-weight: bold;
            color: #272727;
        }

        &-img {
            width: 58px;
            height: 58px;
        }
    }

    .enRouteWarning {
        &-top {
            display: grid;
            grid-template-columns: repeat(3, calc(33.3% - 10px));
            grid-column-gap: 10px;
            text-align: center;

        }
    }


    .notic {
        &-more {

            font-size: 14px;
            font-weight: 500;
            color: rgba(23, 23, 23, 0.8);
        }

        &-rowline {
            position: relative;
            margin-bottom: 6px;

            &.isRead {
                &-label {
                    color: #9B9B9B;
                }

                &-time {
                    color: #AFAFAF;
                }
            }
        }

        &-label {
            font-size: 14px;
            font-weight: 500;
            color: #171717;
            margin-right: 5px;
        }

        &-time {
            font-size: 12px;
            font-weight: 500;
            color: rgba(23, 23, 23, 0.8);
            margin-left: 2px;
        }

        &-badge {
            width: 7px;
            height: 7px;
            background: #FF3000;
            border-radius: 50%;
            position: absolute;
            right: 0;
        }
    }

    .truckingOrder {
        margin-top: 5px;

        &-main {

            display: grid;
            grid-template-columns: repeat(4, calc(25% - 10px));

        }
    }

}
</style>
  