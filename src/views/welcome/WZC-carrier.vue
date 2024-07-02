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
                        <!-- <div>
                            <div class="commonCard-gray">请选择年份</div>
                        </div> -->
                        <div class="disflex ">
                            <div class="disflex realTime-tabBtn cp" :class="realTimeVTYPE == item.value ? 'active' : ''"
                                v-for="(item, index) in realTimeVTYPEList" :key="item.value"
                                @click="realTimeVTYPE = item.value, GetRealTimeData()">
                                <div class="realTimeButton">{{ item.label }}</div>
                                <el-divider direction="vertical" v-if="index < realTimeVTYPEList.length - 1" />
                            </div>
                        </div>
                    </div>

                    <div class="totalData-top">
                        <div v-for="(item, index) in totalDataText" :key="index">
                            <!-- <div class="totalData-top-num">{{item.label}}</div> -->
                            <div class="totalData-top-num">{{ totalData[item.value] || 0 }}</div>
                            <div class="commonCard-commonText">{{ item.label }}</div>
                        </div>
                    </div>
                    <div class="totalData-bottom">
                        <div class="totalData-graph">
                            <div class="">
                                <div class="commonCard-commonText">运费总额(万元）</div>
                                <div class="totalData-bottom-num">{{ totalData.ACCOUNTCOST }}</div>
                                <div class="totalData-bottom-title disflex">
                                    <div>较去年</div>
                                    <img v-if="totalData.ACCOUNTCOSTRATE <= 0" class="arrowsImg"
                                        src="@/assets/images/WZC/arrowsDown.png" alt="">
                                    <img v-else src="@/assets/images/WZC/arrowsUp.png" alt="" class="arrowsImg">
                                    <div>{{ totalData.ACCOUNTCOSTRATE || 0 }}</div>
                                </div>
                            </div>
                            <div id="totalFreight" style="width: 100%;height: 120px;"></div>
                        </div>
                        <div class="totalData-graph">
                            <div>
                                <div class="commonCard-commonText">结算总额(万元）</div>
                                <div class="totalData-bottom-num">{{ totalData.SETTLECOST }}</div>
                                <div class="totalData-bottom-title disflex">
                                    <div>较去年</div>
                                    <img v-if="totalData.SETTLECOSTRATE <= 0" class="arrowsImg"
                                        src="@/assets/images/WZC/arrowsDown.png" alt="">
                                    <img v-else src="@/assets/images/WZC/arrowsUp.png" alt="" class="arrowsImg">
                                    <div>{{ totalData.SETTLECOSTRATE || 0 }}</div>
                                </div>
                            </div>
                            <div id="HWBNumber" style="width: 100%;height: 120px;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="commonCard">

                <div class="notic">
                    <div class="disflex justify-sb">
                        <div class="commonCard-oneLine">
                            <div class="commonCard-titleBlock"></div>
                            <div class="commonCard-titleText">通知公告</div>
                        </div>
                        <!-- <div class="notic-more cp disflex">
                            更多 <el-icon>
                                <ArrowRightBold />
                            </el-icon>
                        </div> -->
                    </div>
                    <div v-for="(item, index) in  noticList " :key="index" class="disflex notic-rowline"
                        :class="item.isRead == 0 ? 'isRead' : ''">
                        <div class="notic-label">{{ item.TITLE }}</div>
                        <div class="notic-time">{{ item.PUBLISHTIME }}</div>
                        <!-- <div class="notic-badge" v-if="item.isRead == 0"></div> -->
                    </div>
                </div>
            </div>
        </div>


        <div class="mt10 commonCard mr10">
            <div class="commonCard-separate">
                <div class="commonCard-oneLine">
                    <div class="commonCard-titleBlock"></div>
                    <div class="commonCard-titleText">超时任务</div>
                </div>
                <!-- <div class="notic-more cp disflex">
                    更多 <el-icon>
                        <ArrowRightBold />
                    </el-icon>
                </div> -->
            </div>
            <div>

            </div>
            <div class="TimeOutTask">
                <div>
                    <el-progress type="circle" :percentage="timedOutTaskData.TASKRATIO" width="150" stroke-width="13"
                        color="#E23A3A">
                        <template #default="{ percentage }">
                            <div class="TimeOutTask-progressBar-label ">任务超时</div>
                            <div class="TimeOutTask-progressBar-num ">{{ timedOutTaskData.TASKNUM }}</div>
                        </template>
                    </el-progress>
                    <div class="disflex mt20">
                        <el-icon class="TimeOutTask-num">
                            <WarningFilled />
                        </el-icon>
                        <span class="TimeOutTask-text">当前还有</span>
                        <span class="TimeOutTask-num">{{ timedOutTaskData.TASKNUM }}条超时任务</span>
                    </div>
                </div>
                <div>
                    <el-table :data="timedOutTaskData.TASKLIST" style="width: 100%" :header-cell-style="tableHeaderStyle">
                        <el-table-column type="index" label="编号" width="50" />
                        <el-table-column prop="BILLNO" label="单号" />
                        <el-table-column prop="ENTRUSTNAME" label="委托单位" />
                        <el-table-column prop="CARNO" label="车牌号" />
                        <el-table-column prop="DRIVERNAME" label="司机" />
                        <el-table-column prop="LOADTIME" label="装货时间" />
                        <el-table-column prop="ARRIVETIME" label="预计送达时间" />
                        <!-- <el-table-column prop="address" label="状态" /> -->
                        <!-- <el-table-column prop="address" label="操作" /> -->
                    </el-table>
                </div>
            </div>
        </div>

        <div class="mt10 commonCard mr10">
            <div class="commonCard-separate">
                <div class="commonCard-oneLine">
                    <div class="commonCard-titleBlock"></div>
                    <div class="commonCard-titleText">代办事项</div>
                </div>
                <!-- <div class="notic-more cp disflex">
                    更多 <el-icon>
                        <ArrowRightBold />
                    </el-icon>
                </div> -->
            </div>
            <div>

            </div>
            <div class="commission"  v-if="todoListData.TODONUMS && todoListData.TODONUMS.length">
                <div class="commission-left">
                    <div v-for="(item, index) in commissionText " :key="index" class="commission-left-block cp"
                        @click="chooseCommission(index)" :class="index == chooseCommissionIndex ? 'filstcommission' : ''">
                        <div class="commission-left-label">
                            {{ item.label }} <el-icon>
                                <ArrowRightBold />
                            </el-icon>
                        </div>
                        <div class="commission-left-num">{{ todoListData.TODONUMS[index]?.NUM || 0 }} <span
                                class="commission-left-addNum"
                                :style="index == chooseCommissionIndex ? { color: '#1964F8' } : '0'">单</span> </div>
                        <div class="commission-left-addNum" v-if="item.addNum">今日新增 <span style="color: #FF9900;">{{
                            todoListData.TODONUMS[index]?.NUMSCOPE || 0 }} 单</span></div>
                        <div class="commission-left-addNum" v-else>今日无新增</div>
                    </div>

                </div>
                <div class="">
                    <el-table :data="todoListData.TODOLIST" style="width: 100%" :header-cell-style="tableHeaderStyle">
                        <el-table-column type="index" label="编号" width="50" />
                        <el-table-column prop="BILLNO" label="单号" />
                        <el-table-column prop="VCODE" label="单据编码" />
                        <el-table-column prop="VNAME" label="名称" />
                        <el-table-column prop="BILLSTATUS" label="状态" />
                        <el-table-column prop="PROMOTER" label="发起人" />
                        <el-table-column prop="PROMOTETIME" label="发起时间" />
                    </el-table>
                </div>
            </div>
        </div>

        <div class="commonCard mt10 mr10">
            <div class="commonCard-separate">
                <div class="commonCard-oneLine">
                    <div class="commonCard-titleBlock"></div>
                    <div class="commonCard-titleText mr10">运输统计</div>
                </div>
                <div class="disflex ">
                    <div class="disflex realTime-tabBtn cp" :class="transportVTYPE == item.value ? 'active' : ''"
                        v-for="(item, index) in transportVTYPEList" :key="item.value"
                        @click="transportVTYPE = item.value, GetTransportData()">
                        <div class="realTimeButton">{{ item.label }}</div>
                        <el-divider direction="vertical" v-if="index < transportVTYPEList.length - 1" />
                    </div>
                </div>
            </div>
            <div id="dispatchCondition" style="width: 100%;height: 300px;"></div>
        </div>





    </div>
</template>
  
<script setup name="">
import * as echarts from "echarts";
let myEcharts = echarts;
const { proxy } = getCurrentInstance();
const router = useRouter();


import { onMounted, onUnmounted, ref } from "vue";

import { getTotalData, totalDataText, getTimedOutTask, getTransportData, transportVTYPEList, getNotice, commissionText, getTodoList } from "#/WZC/welcome/WZC-carrier.js";






onMounted(() => {

    GetTotalData()
    GetNotice()
    GetTransportData()

    GetTimedOutTask()

    GetTodoList()
});

const totalData = ref({})
function GetTotalData() {
    getTotalData({}).then((res) => {
        totalData.value = res.RESULT
        let drawTotalFreightNumArr = []
        let drawTotalFreightDateArr = []
        totalData.value.ACCOUNTCOSTTREND.forEach(ele => {
            drawTotalFreightNumArr.push(ele.NUM)
            drawTotalFreightDateArr.push(ele.CREATEDATE)
        })
        drawTotalFreight(drawTotalFreightNumArr, drawTotalFreightDateArr)

        let drawHWBNumberNumArr = []
        let drawHWBNumberDateArr = []
        totalData.value.SETTLECOSTTREND.forEach(ele => {
            drawHWBNumberNumArr.push(ele.NUM)
            drawHWBNumberDateArr.push(ele.CREATEDATE)
        })

        drawHWBNumber(drawHWBNumberNumArr, drawHWBNumberDateArr)


    });
}
const noticList = ref([])
const GetNotice = () => {
    let data = {
        MODULEID: "MU221012772756",
        PAGEID: "PG221012151975",
        PAGENUM: 1,
        PAGESIZE: 8
    }
    getNotice(data).then((res) => {
        noticList.value = res.RESULT.RECORDS
    });
}


const timedOutTaskData = ref({})
const GetTimedOutTask = () => {
    getTimedOutTask({
        // VTYPE: realTimeVTYPE.value
    }).then((res) => {
        console.log("🚀 ~ file: WZC-carrier.vue:296 ~ GetTimedOutTask ~ res:", res)
        timedOutTaskData.value = res.RESULT
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

const todoListData = ref({})
const GetTodoList = (VTYPE = '') => {
    getTodoList({
        VTYPE: VTYPE
    }).then((res) => {
        const {TODOLIST,TODONUMS} = res.RESULT
        todoListData.value.TODOLIST = TODOLIST
        TODONUMS?todoListData.value.TODONUMS = TODONUMS:''
    });
}
const chooseCommissionIndex = ref(0)
const chooseCommission = (index) => {
    chooseCommissionIndex.value = index
    GetTodoList(todoListData.value.TODONUMS[index]?.VTYPE)
}
const transportVTYPE = ref('DAY')
function GetTransportData() {
    getTransportData({
        VTYPE: transportVTYPE.value
    }).then((res) => {
        // dispatchStatData.value = res.RESULT
        drawdispatchCondition(res.RESULT)
    });
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

const drawdispatchCondition = (dataArr) => {
    let textArr = ['运费', '运量']
    let showData = [
        ['运费', '运量'],...dataArr
    ]
    let chart = myEcharts.init(document.getElementById("dispatchCondition"), "purple-passion");
    chart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: function (data) {
                console.log(data)
                return  data.name + '<br/>' + data.marker + textArr[data.componentIndex] + ': ' + data.value[data.componentIndex + 1] + '<br/>';
            },
        },
        // legend: {
        //     top: '5%',
        //     left: 'center'
        // },
        color: ['#1964F8', '#05BB8D'],
        // legend: {},
        // tooltip: {},
        dataset: {
            // dispatchStatData.value
            // source: dataArr
            source:showData
            // [
            //     ['日期', '派单', '签收'],
            //     ['4/12', 43.3, 85.8],
            //     ['4/13', 83.1, 73.4],
            //     ['4/14', 86.4, 65.2],
            //     ['4/15', 72.4, 53.9]
            // ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{
            type: 'bar',
            barMaxWidth: '16px',
        }, {
            type: 'bar',
            barMaxWidth: '16px',
        }]
    });
    // 大小自适应窗口大小变化
    window.onresize = function () {
        // 重置容器高宽
        chart.resize();
    };
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
            margin-bottom: 10px;
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
        }
    }

    .left2right1 {
        display: grid;
        grid-template-columns: calc(65% - 10px) calc(35% - 10px);
        grid-column-gap: 10px;
    }

    .divideMiddle4 {
        display: grid;
        grid-template-columns: repeat(4, 25%);
        //   grid-column-gap: 10px;
    }

    .totalData {
        &-top {
            display: grid;
            // grid-template-columns: repeat(6, calc(16.5% - 10px));
            // grid-template-columns: repeat(6, calc(25% - 10px));
            grid-template-columns: repeat(5, calc(20% - 10px));

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
                margin-top: 5px;
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
            // grid-template-columns: (calc(35% - 10px)) calc(65% - 10px);
            // grid-column-gap: 10px;
            align-items: center;
            justify-items: center;
        }
    }

    .realTime {
        &-hint {
            padding: 0 10px;
            height: 44px;
            background: #F3F7FE;
            border-radius: 6px;

            font-size: 13px;
            font-weight: 500;
            color: #02071A;
            line-height: 44px;
            margin-bottom: 20px;
        }

        &-blueText {
            color: #1964F8;
            margin-right: 10px;
        }

        &-bottom {
            margin-top: 10px;
            display: grid;
            grid-template-columns: calc(30% - 10px) repeat(4, calc(17.5% - 10px));
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
            height: 100px;
            overflow-y: auto;
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


    .ranking {
        &-img {
            width: 29px;
            // height: 35px;
        }

        &-block {
            width: 22px;
            height: 22px;
            background: #E4E5EB;
            border-radius: 50%;

            font-size: 13px;
            font-weight: 500;
            color: #171717;
            text-align: center;
            line-height: 22px;
            margin-bottom: 3px;
            margin-left: 4px;
        }

        :deep(.el-table .el-table__header-wrapper th, .el-table .el-table__fixed-header-wrapper th) {
            background-color: #fff !important;
            border: none;
            font-size: 15px;
            font-weight: 500;
            color: rgba(23, 23, 23, 0.6);
        }

        :deep(.el-table .el-table__cell) {
            // background-color: #f44f !important;
            border: none !important;
            font-size: 15px;
            font-weight: 500;
            color: rgba(23, 23, 23, 1);

        }

        :deep(.el-table__inner-wrapper::before) {
            display: none;
        }
    }

    .mapBlock {
        display: grid;
        grid-template-columns: 65% 35%;
        margin-top: 20px;

        &-title {
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: bold;
            color: #272727;
        }

        &-cust {
            margin-bottom: 6px;

            &-num {
                font-size: 17px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #696969;
                // margin-right: 10px;
                width: 25px;
            }

            &-text {

                font-size: 13px;
                font-weight: 500;
                color: #161617;
            }
        }
    }

    .purchasingRatio {
        display: grid;
        grid-template-columns: repeat(2, 50%);
        align-items: center;

        &-rightTitle {
            font-size: 14px;
            font-weight: bold;
            color: rgba(39, 39, 39, 0.6);
            margin-bottom: 10px;
        }

        &-content {
            font-size: 13px;
            font-weight: 500;
            color: #161617;
            margin-bottom: 10px;
        }

        &-colorBlock {
            width: 9px;
            height: 9px;
            background: #1964F8;
            margin-right: 5px;
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
            margin-bottom: 4px;

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




    .TimeOutTask {
        display: grid;
        grid-template-columns: calc(25% - 10px) calc(75% - 10px);
        // align-items: center;

        &-num {
            font-size: 16px;
            font-weight: 500;
            color: #F54141;
        }

        &-text {
            font-size: 16px;
            font-weight: 500;
            color: #98A1AA;
        }

        &-progressBar {
            &-label {

                font-size: 20px;
                font-weight: 500;
                color: #979EA6;
                margin-bottom: 4px;
            }

            &-num {

                font-size: 35px;
                font-weight: 800;
                color: #191D25;
            }
        }

        :deep(.el-table .el-table__header-wrapper th, .el-table .el-table__fixed-header-wrapper th) {
            background-color: #EDF4FE !important;
        }
    }

    .commission {
        display: grid;
        grid-template-columns: 30% 70%;
        // align-items: center;

        &-left {
            display: grid;
            grid-template-columns: repeat(2, calc(50% - 10px));
            grid-column-gap: 10px;

            align-items: center;
            text-align: center;

            &-block {
                margin-bottom: 20px;
                padding: 10px 10px 0 10px;
            }

            &-label {
                align-items: center;
                font-size: 15px;
                font-weight: bold;
                color: rgba(39, 39, 39, 0.6);
            }

            &-num {
                font-size: 38px;
                font-weight: 800;
                color: #272727;
            }

            &-addNum {
                font-size: 13px;
                font-weight: 500;
                color: #7E7E7E;
            }

            .filstcommission {
                background: linear-gradient(to bottom, #C6D9FE, #F3F7FF);
                border-radius: 10px;
                // padding: 10px 10px 0 10px;

                .commission-left-label,
                .commission-left-num {
                    color: #1964F8;
                }
            }
        }

        :deep(.el-table .el-table__header-wrapper th, .el-table .el-table__fixed-header-wrapper th) {
            background-color: #EDF4FE !important;
        }
    }

}
</style>
  