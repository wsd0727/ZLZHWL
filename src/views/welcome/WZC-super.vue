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
                    </div>

                    <div class="totalData-top">
                        <div v-for="(item, index) in totalDataText" :key="index">
                            <!-- <div class="totalData-top-num">{{item.label}}</div> -->
                            <div class="totalData-top-num">{{autoUnitVal(totalData[item.value],item).value}}</div>
                            <div class="commonCard-commonText">{{autoUnitVal(totalData[item.value],item).label}}</div>
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
                                <div class="commonCard-commonText">运单数（个）</div>
                                <div class="totalData-bottom-num">{{ totalData.SENDCARNUMS || 0 }}</div>
                                <div class="totalData-bottom-title disflex">
                                    <div>较去年</div>
                                    <img v-if="totalData.SENDCARNUMSRATE <= 0" class="arrowsImg"
                                        src="@/assets/images/WZC/arrowsDown.png" alt="">
                                    <img v-else src="@/assets/images/WZC/arrowsUp.png" alt="" class="arrowsImg">
                                    <div>{{ totalData.SENDCARNUMSRATE || 0 }}</div>
                                </div>
                            </div>
                            <div id="HWBNumber" style="width: 100%;height: 120px;"></div>
                        </div>
                    </div>
                </div>
                <div class="commonCard realTime">
                    <div class="commonCard-separate">
                        <div class="commonCard-oneLine">
                            <div class="commonCard-titleBlock"></div>
                            <div class="commonCard-titleText">实时数据</div>
                        </div>
                        <div class="disflex ">
                            <!-- <div class="commonCard-gray">请选择年份</div> -->
                            <!-- <div class="disflex realTime-tabBtn cp" :class="realTimeVTYPE == item.value ? 'active' : ''"
                                v-for="(item, index) in realTimeVTYPEList" :key="item.value"
                                @click="realTimeVTYPE = item.value, GetRealTimeData()">
                                <div class="realTimeButton">{{ item.label }}</div>
                                <el-divider direction="vertical" v-if="index < realTimeVTYPEList.length - 1" />
                            </div> -->
                            <!-- <div class="realTimeButton" @click="realTimeVTYPE = 'DAY'" >日数据</div>
                            <el-divider direction="vertical" />
                            <div @click="realTimeVTYPE = 'MONTH'">月数据</div>
                            <el-divider direction="vertical" />
                            <div @click="realTimeVTYPE = 'YEAR'">年数据</div> -->

                            <!-- <el-button class="ml20">管理数据</el-button> -->
                        </div>
                    </div>
                    <div class="realTime-hint disflex">
                        <img src="@/assets/images/WZC/laba.png" class="realTime-img mr5" alt="">
                        <div class="mr5">今日新增订单</div>
                        <div class="realTime-blueText"> {{ realTimeData.TDYORDERNUMSCOPE }}单 </div>
                        <div class="realTime-blueText cp" @click="gotoOrder"> 请前去查看</div>
                    </div>
                    <div class="realTime-bottom">
                        <div>
                            <div class="commonCard-commonText mb5 disflex ">
                                <div class="mr5">签收总量</div>
                                <div class="realTime-colorLump"
                                    :class="{ 'active': realTimeData.SIGNANUMSRATE >= '20%' }">
                                </div>
                                <div class="realTime-colorLump"
                                    :class="{ 'active': realTimeData.SIGNANUMSRATE >= '40%' }">
                                </div>
                                <div class="realTime-colorLump"
                                    :class="{ 'active': realTimeData.SIGNANUMSRATE >= '60%' }">
                                </div>
                                <div class="realTime-colorLump"
                                    :class="{ 'active': realTimeData.SIGNANUMSRATE >= '80%' }">
                                </div>
                                <div class="realTime-colorLump"
                                    :class="{ 'active': realTimeData.SIGNANUMSRATE == '100%' }">
                                </div>
                            </div>
                            <div class="totalData-bottom-num textFF9900"> {{ autoUnitVal(realTimeData.SIGNAMOUNT,{"value":realTimeData.SIGNAMOUNT,"label":'吨'}).value }}<span
                                class="totalData-bottom-title">{{ autoUnitVal(realTimeData.SIGNAMOUNT,{"value":realTimeData.SIGNAMOUNT,"label":'吨'}).label }}</span> </div>
                            <!-- <div class="totalData-bottom-num textFF9900"> {{ realTimeData.SIGNAMOUNT }}<span
                                    class="totalData-bottom-title">吨</span> </div> -->
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
            </div>
            <div class="commonCard">

                <div class="notic" v-if="userInfo.ACCOUNTTYPE != 2">
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
                <div class="firstAid">
                    <div class="firstAid-header">
                        <div class="firstAid-header-title">紧急处理</div>
                        <div class="divideMiddle4 firstAid-header-text mt10">
                            <div>预警类型</div>
                            <div>车牌号</div>
                            <div>处理</div>
                            <div>操作</div>
                        </div>
                    </div>
                    <div class="firstAid-main" id="scrollData" ref="scrollData">

                        <el-carousel trigger="click" height="250" direction="vertical" :interval="5000">
                            <el-carousel-item v-for="(items, indexs) in warningData.dividePENDLIST" :key="index">
                                <!-- <div class="textFF3000 ">
                                    {{ selectDictLabel(yjlx, item.VTYPE) }}
                                </div>
                                <div>{{ item.CARNO }}</div>
                                <div class="textFF3000">{{ selectDictLabel(yjshzt, item.BILLSTATUS) }}</div>
                                <div class="textFF3000 cp" @click="gotoWarning">详情</div> -->
                                <div class="divideMiddle4 text-c font500 f13" v-for=" item  in  items "
                                    :key="item.CARNO">
                                    <div class="textFF3000 ">
                                        {{ selectDictLabel(yjlx, item.VTYPE) }}
                                    </div>
                                    <div>{{ item.CARNO }}</div>
                                    <div class="textFF3000">{{ selectDictLabel(yjshzt, item.BILLSTATUS) }}</div>
                                    <div class="textFF3000 cp" @click="gotoWarning">详情</div>
                                </div>
                            </el-carousel-item>
                        </el-carousel>


                        <!-- <div class="divideMiddle4 text-c font500 f13" v-for=" item  in  warningData.PENDLIST "
                            :key="item.CARNO">
                            <div class="textFF3000 ">
                                {{ selectDictLabel(yjlx, item.VTYPE) }}
                            </div>
                            <div>{{ item.CARNO }}</div>
                            <div class="textFF3000">{{ selectDictLabel(yjshzt, item.BILLSTATUS) }}</div>
                            <div class="textFF3000 cp" @click="gotoWarning">详情</div>
                        </div> -->
                    </div>
                </div>
                <template v-if="userInfo.ACCOUNTTYPE == 2">

                    <div class="plantWarning">
                        <div class="commonCard-titleText mt10 mb10">厂内预警</div>
                        <div class="plantWarning-top">
                            <div class="disflex">
                                <div class="mr20">
                                    <img src="@/assets/images/WZC/plantWarning1.png" class="plantWarning-img" alt="">
                                </div>
                                <div>
                                    <div class="commonCard-commonText">厂内数量</div>
                                    <div class="plantWarning-num">{{ warningData.INFACTORYNUMS }}</div>
                                </div>
                            </div>
                            <div class="disflex">
                                <div class="mr20">
                                    <img src="@/assets/images/WZC/plantWarning2.png" class="plantWarning-img" alt="">
                                </div>
                                <div>
                                    <div class="commonCard-commonText">等待入厂</div>
                                    <div class="plantWarning-num">{{ warningData.WAITFACTORYNUMS }}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="font500 text272727 f15 mt10">装卸完成</div>
                            <el-progress :percentage="warningData.LOADFINISHRATE" />
                        </div>
                    </div>

                    <div class="enRouteWarning">
                        <div class="commonCard-titleText mt10 mb10">在途预警</div>
                        <div class="enRouteWarning-top">
                            <div>
                                <div class="plantWarning-num"> {{ warningData.INTRANSITNUMS }}</div>
                                <div class="commonCard-commonText">在途数量</div>
                            </div>
                            <div>
                                <div class="plantWarning-num">{{ warningData.ARRIVENUMS }}</div>
                                <div class="commonCard-commonText">送达数量</div>
                            </div>
                            <div>
                                <div class="plantWarning-num" style="color:#E42B2B">{{ warningData.OFFLINENUMS }}</div>
                                <div class="commonCard-commonText" style="color: rgba(228, 43, 43, 0.6);">离线数量</div>
                            </div>
                        </div>
                    </div>
                </template>

            </div>
        </div>
        <div class="material commonCard mr10">
            <div class="commonCard-separate">
                <div class="commonCard-oneLine">
                    <div class="commonCard-titleBlock"></div>
                    <div class="commonCard-titleText">物料占比</div>
                </div>
                <!-- <div class="disflex">
                    <div class="commonCard-gray mr10">请选择统计时间</div>
                    <el-date-picker v-model="materialVal" type="daterange" range-separator="-" start-placeholder="开始时间"
                        value-format="YYYY-MM-DD" end-placeholder="结束时间" @Change="GetMaterialStatData" />
                </div> -->
            </div>
            <div class="material-main">
                <div>
                    <div class="material-main-leftCard">
                        <div>
                            <div class="material-main-leftCard-title">销售物料（万吨）</div>
                            <div class="material-main-leftCard-num">{{ materialStatData.XSMATTOTAL }}</div>
                            <div class="material-main-leftCard-info">去年同期
                                <img v-if="materialStatData.XSMATTOTALSCOPE <= 0" class="arrowsImg"
                                    src="@/assets/images/WZC/arrowsDown.png" alt="">
                                <img v-else src="@/assets/images/WZC/arrowsUp.png" class="arrowsImg" alt="">
                                <!-- {{ materialStatData.XSMATTOTALSCOPE }}吨 -->
                                {{ autoUnitVal(materialStatData.XSMATTOTALSCOPE,{value:materialStatData.XSMATTOTALSCOPE,label:"吨"}).value }}
                                {{ autoUnitVal(materialStatData.XSMATTOTALSCOPE,{value:materialStatData.XSMATTOTALSCOPE,label:"吨"}).label }}

                            </div>
                        </div>
                        <div>
                            <img src="@/assets/images/WZC/material3.png" class="material-img" alt="">
                        </div>
                    </div>
                    <div class="material-main-leftCard material-main-leftCard2 mt10">
                        <div>
                            <div class="material-main-leftCard-title">采购物料（万吨）</div>
                            <div class="material-main-leftCard-num">{{ materialStatData.CGMATTOTAL }}</div>
                            <div class="material-main-leftCard-info">去年同期
                                <img v-if="materialStatData.CGMATTOTALSCOPE <= 0" class="arrowsImg"
                                    src="@/assets/images/WZC/arrowsDown.png" alt="">
                                <img v-else src="@/assets/images/WZC/arrowsUp.png" class="arrowsImg" alt="">
                                <!-- {{ materialStatData.CGMATTOTALSCOPE }}吨 -->
                                {{ autoUnitVal(materialStatData.CGMATTOTALSCOPE,{value:materialStatData.CGMATTOTALSCOPE,label:"吨"}).value }}
                                {{ autoUnitVal(materialStatData.CGMATTOTALSCOPE,{value:materialStatData.CGMATTOTALSCOPE,label:"吨"}).label }}
                            </div>
                        </div>
                        <div>
                            <img src="@/assets/images/WZC/material4.png" class="material-img" alt="">
                        </div>
                    </div>
                </div>
                <div>
                    <div class="commonCard-titleText">销售趋势（万吨）</div>
                    <div>
                        <div class="chart" id="salesTrend" style="width: 100%;height: 300px;"></div>
                    </div>
                </div>
                <div>
                    <div class="commonCard-titleText">采购比例</div>
                    <div class="purchasingRatio">
                        <div class="chart" id="purchasingRatio" style="width: 100%;height: 300px;"></div>
                        <div>
                            <div class="purchasingRatio purchasingRatio-rightTitle">
                                <div>物料名称</div>
                                <div>数量(万吨)</div>
                            </div>

                            <div class="purchasingRatio purchasingRatio-content"
                                v-for="( item, index ) in  materialStatData.CGMATDATA " :key="index">
                                <div class="disflex">
                                    <div class="purchasingRatio-colorBlock"
                                        :style="{ backgroundColor: purchasingRatioColor[index] }"></div> {{ item.VNAME
                                    }}
                                </div>
                                <div>{{ item.NUM }}</div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>

        <div class="left2right1 mt10">
            <div class="commonCard">
                <div class="commonCard-separate">
                    <div class="commonCard-oneLine">
                        <div class="commonCard-titleBlock"></div>
                        <div class="commonCard-titleText">客商企业分布</div>
                    </div>
                    <div>
                        <!-- <div class="commonCard-gray">请选择年份</div> -->
                        <el-select v-model="mapVCODE" class="m-2" placeholder="全国" size="small" clearable filterable
                            @change="GetCustSpreadData">
                            <el-option v-for=" item  in  areaData " :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                </div>
                <!-- <div id="customerAnalysis" ref="customerAnalysisRef"
                  :style="{ width: `${mapWidth}px`, height: `${centerHeight}px` }"></div> -->
                <div class="mapBlock">
                    <div id="china" ref="chinaRef" style="width: 100%;height: 300px;"></div>
                    <div>
                        <div class="mapBlock-title">TOP10</div>
                        <div class="disflex mapBlock-cust" v-for="( item, index ) in  custSpreadData.CUSTOMLIST "
                            :key="index">
                            <div class="mapBlock-cust-num"
                                :style="{ color: index == 0 ? '#EA3F11' : index == 1 ? '#EAB911' : index == 2 ? '#1964F8' : '#696969' }">
                                {{
                            index + 1 }}</div>
                            <div class="mapBlock-cust-text">{{ item }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="commonCard">
                <div class="commonCard-separate">
                    <div class="commonCard-oneLine">
                        <div class="commonCard-titleBlock"></div>
                        <div class="commonCard-titleText">线路统计</div>
                    </div>
                    <div>
                        <!-- <div class="commonCard-gray">请选择年份</div> -->
                        <el-select v-model="lineVCODE" class="m-2" placeholder="全国" size="small" clearable filterable
                            @change="GetLineRankData()">
                            <el-option v-for=" item  in  areaData " :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>
                </div>
                <div class="ranking">
                    <el-table :data="lineRankData" style="width: 100%;height: 340px;">
                        <el-table-column prop="date" label="排名" width="60">

                            <template #default="scope">
                                <img src="@/assets/images/WZC/ranking1.png" class="ranking-img" alt=""
                                    v-if="scope.$index == 0">
                                <img src="@/assets/images/WZC/ranking2.png" class="ranking-img" alt=""
                                    v-else-if="scope.$index == 1">
                                <img src="@/assets/images/WZC/ranking3.png" class="ranking-img" alt=""
                                    v-else-if="scope.$index == 2">
                                <div src="" alt="" v-else class="ranking-block">{{ scope.$index + 1 }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="LINENAME" label="线路名称" width="140" />
                        <el-table-column prop="TRANSPORTAMOUNT" label="运输总量" />
                        <el-table-column prop="TRANSPORTCOST" label="预估运费" />
                    </el-table>
                </div>
            </div>
        </div>

        <div class="commonCard mt10 mr10">
            <div class="commonCard-separate">
                <div class="commonCard-oneLine">
                    <div class="commonCard-titleBlock"></div>
                    <div class="commonCard-titleText mr10">派车情况</div>
                    <el-date-picker v-model="dispatchStatVal" type="daterange" range-separator="-"
                        start-placeholder="开始时间" value-format="YYYY-MM-DD" end-placeholder="结束时间"
                        @Change="GetDispatchStatData" />
                    <el-select v-model="sendCarData.BUSSTYPE" placeholder="选择业务类型" class="ml5 mr5"
                        @Change="GetDispatchStatData">
                        <el-option label="采购" :value="1" />
                        <el-option label="销售" :value="2" />
                        <el-option label="调拨" :value="3" />
                    </el-select>
                    <el-select v-model="sendCarData.PK_MATERIAL" placeholder="选择物料" clearable
                        @Change="GetDispatchStatData">
                        <el-option v-for="item in materialsList" :key="item.VALUE" :label="item.LABEL"
                            :value="item.VALUE" />
                    </el-select>
                </div>
                <div>
                    <!-- <div class="commonCard-gray">请选择年份</div> -->
                </div>
            </div>
            <div id="dispatchCondition" style="width: 100%;height: 300px;"></div>
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

import { getTotalData, totalDataText, getRealTimeData, realTimeVTYPEList, realTimeTextList, getWarningData, getLineRankData, getCustSpreadData, getMaterialStatData, getDispatchStatData, getNotice, getSelectMaterials } from "#/WZC/welcome/WZC-super.js";
// import {areaData} from "/Users/dai/Documents/work/Eosine/WZC/public/areadata.js"
import areaData from "../../../public/areadata"
const { yjlx, yjshzt } = proxy.useDict("yjlx", "yjshzt")
// import { parseTime } from "./ruoyi.js";
import { parseTime } from "@/utils/ruoyi.js";

const currentDate = ref('')
const lastMonthDate = ref('')


onMounted(() => {
    let nowDate = new Date()
    // console.log(new Date().getFullYear())
    // console.log(new Date().getMonth())
    // console.log(new Date().getDate())
    // currentDate.value = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate()

    if (nowDate.getMonth() == 0) {
        currentDate.value = nowDate.getFullYear() + '-' + "01" + '-' + (nowDate.getDate() >= 10 ? nowDate.getDate() : "0" + nowDate.getDate())
        lastMonthDate.value = (nowDate.getFullYear() - 1) + '-' + "12" + '-' + (nowDate.getDate() >= 10 ? nowDate.getDate() : "0" + nowDate.getDate())
    } else {
        currentDate.value = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1 >= 10 ? nowDate.getMonth() + 1 : "0" + (nowDate.getMonth() + 1)) + '-' + (nowDate.getDate() >= 10 ? nowDate.getDate() : "0" + nowDate.getDate())
        lastMonthDate.value = nowDate.getFullYear() + '-' + (nowDate.getMonth() >= 10 ? nowDate.getMonth() : "0" + nowDate.getMonth()) + '-' + (nowDate.getDate() >= 10 ? nowDate.getDate() : "0" + nowDate.getDate())
    }


    querySelectMaterials()
    // console.log(parseTime( new Date() ) )

    GetTotalData()
    GetRealTimeData()
    GetWarningData()
    GetLineRankData()
    GetCustSpreadData()
    GetMaterialStatData()


    GetDispatchStatData()


    if (userInfo.value.ACCOUNTTYPE != 2) {
        GetNotice()

    }
    // autoSroll('scrollData')

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



const timer = ref(null)

const sendCarData = ref({
    BUSSTYPE: 1,
})
const materialsList = ref([])
const querySelectMaterials = () => {
    getSelectMaterials().then((res) => {
        materialsList.value = res.RESULT
    });

}

const scrollData = ref(null)
// 预警滚动
const autoSroll = (Id) => {
    // flag 为true时停止滚动
    // let flag = false;
    // 定时器
    // let timer;
    function roll() {
        let h = -1;

        timer.value = setInterval(function () {


            // flag = true;
            //获取当前滚动条高度
            // let current = document.getElementById(Id).scrollTop;
            let current = scrollData.value.scrollTop;

            // if (Id && current != null) {

            if (current == h) {
                //滚动到底端,返回顶端
                h = 0;
                // document.getElementById(Id).scrollTop = h + 1;
                scrollData.value.scrollTop = h + 1

            } else {
                //以25ms/3.5px的速度滚动
                h = current;
                // document.getElementById(Id).scrollTop = h + 1;
                scrollData.value.scrollTop = h + 1
            }
            // }

        }, 50);
    }
    //滚动区域内单击鼠标 滚动暂停 再次点击鼠标 继续滚动
    // document.getElementById(Id).onclick = () => {
    //     console.log("点击了", timer, flag);
    //     if (flag) {
    //         flag = false;
    //         clearInterval(timer);
    //     } else {
    //         roll();
    //     }
    // document.getElementById(Id).onmouseover = () => {
    //     clearInterval(timer);
    // };
    // document.getElementById(Id).onmouseleave = () => {
    //     roll()
    // };


    roll();
}



//货主公告页面
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
        totalData.value.SENDCARNUMSTREND.forEach(ele => {
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
const lineRankData = ref([])
const lineVCODE = ref('')
function GetLineRankData() {
    getLineRankData({ VCODE: lineVCODE.value }).then((res) => {
        lineRankData.value = res.RESULT
    });
}
const custSpreadData = ref({})
const mapVCODE = ref('')
const selectRegions = ref([])

async function GetCustSpreadData(value) {


    let selectMapLabel = areaData.filter(ele => ele.value == mapVCODE.value)

    selectMapLabel.length ? selectRegions.value = [{ name: selectMapLabel[0].label, itemStyle: { areaColor: "#Fae06d" } }] : ''  // 接口没数据时选中 select 的高亮

    getCustSpreadData({ VCODE: mapVCODE.value }).then((res) => {
        custSpreadData.value = res.RESULT

        custSpreadData.value.mapData = custSpreadData.value.USERLIST.map(ele => {
            return {
                name: ele.PROVINCENAME,
                value: selectMapLabel.length && selectMapLabel[0].label == ele.PROVINCENAME ? 99999 : ele.NUMS,  // 接口没数据时选中 select 的高亮
                showValue: ele.NUMS
            }
        })



        customerAnalysis()
    });
}
const gotoOrder = () => {
    router.push('/oms/tsOrder')
}
const gotoWarning = () => {
    router.push('/tms/warninfo')
}

const materialStatData = ref({})
const materialVal = ref([])

function GetMaterialStatData() {
    let CREATEDATE = materialVal.value[0] ? materialVal.value[0] + ',' + materialVal.value[1] : lastMonthDate.value + ',' + currentDate.value
    getMaterialStatData({ CREATEDATE: CREATEDATE }).then((res) => {
        materialStatData.value = res.RESULT
        drawSalesTrend()
        drawPurchasingRatio()
    });
}
// const dispatchStatData = ref([])
const dispatchStatVal = ref('')
function GetDispatchStatData() {
    let CREATEDATE = dispatchStatVal.value[0] ? dispatchStatVal.value[0] + ',' + dispatchStatVal.value[1] : lastMonthDate.value + ',' + currentDate.value

    dispatchStatVal.value.length == 0 ? dispatchStatVal.value = [lastMonthDate.value, currentDate.value] : ''

    getDispatchStatData({ CREATEDATE: CREATEDATE, ...sendCarData.value }).then((res) => {
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
const drawSalesTrend = () => {
    let chart = myEcharts.init(document.getElementById("salesTrend"), "purple-passion");
    chart.setOption({
        color: ['#1964F8'],
        xAxis: {
            type: 'category',
            data: materialStatData.value.XSMATDATE
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: materialStatData.value.XSMATAMOUNT,
                type: 'bar',
                // barWidth: '16px'
                barMaxWidth: '16px',
                label: {
                    show: true,
                    // position: 'inside'
                },
            }
        ]
    });
    // 大小自适应窗口大小变化
    window.onresize = function () {
        // 重置容器高宽
        chart.resize();
    };
}
const purchasingRatioColor = ref(['#1964F8', '#50CEF9', '#BACCFC', '#B0E8FE', '#DEE2E5'])
const drawPurchasingRatio = () => {
    let data = materialStatData.value.CGMATDATA.map(ele => {
        return {
            label: ele.VNAME,
            value: ele.NUM
        }
    })

    let num = 10
    let chart = myEcharts.init(document.getElementById("purchasingRatio"), "purple-passion");
    chart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: function (data) {
                return data.marker + data.data.label + ': ' + data.value + '<br/>';
            },
        },
        // legend: {
        //     top: '5%',
        //     left: 'center'
        // },
        color: purchasingRatioColor.value,
        series: [
            {
                name: '采购比例',
                type: 'pie',
                radius: ['50%', '60%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    // borderRadius: 10,
                    borderColor: '#fff',
                    // borderWidth: 2
                },
                // label: {
                //     show: false,
                //     position: 'center'
                // },
                label: {
                    position: 'center',
                    show: true,
                    formatter: () => {
                        let str = '采购数量(万吨)' + '\n' + `${num}`
                        return str
                    },
                    color: '#979EA6',
                    // lineHeight: 16,
                    fontSize: 16,
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },

                data: data

                // [
                //     { value: 1048, name: '物料一' },
                //     { value: 735, name: '物料二' },
                //     { value: 580, name: '物料三' },
                //     { value: 484, name: '物料四' },
                //     { value: 300, name: '物料五' }
                // ]
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
    let textArr = ['派单', '签收']
    // let arr = ['', '派单', '签收']
    // let arr = []
    // arr.push(...data)
    // console.log("🚀 ~ file: WZC-super.vue:734 ~ drawdispatchCondition ~ arr:", arr)
    let showData = [
        ['日期','派单', '签收'], ...dataArr
    ]
    let chart = myEcharts.init(document.getElementById("dispatchCondition"), "purple-passion");
    chart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: function (data) {
                return data.name + '<br/>' + data.marker + textArr[data.componentIndex] + ': ' + data.value[data.componentIndex + 1] + '<br/>';
            },
        },
        legend: {
            top: '5%',
            // left: 'center'
            right: '5%',
            data: ['派单', '签收']
        },
        color: ['#1964F8', '#05BB8D'],
        // legend: {},
        // tooltip: {},
        dataset: {
            // dispatchStatData.value
            // source: dataArr
            source: showData
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
            name: '派单',
        }, {
            type: 'bar',
            barMaxWidth: '16px',
            name: '签收',

        }]
    });
    // 大小自适应窗口大小变化
    window.onresize = function () {
        // 重置容器高宽
        chart.resize();
    };
}

const customerAnalysis = () => {
    // let chart = myEcharts.init(document.getElementById("dispatchCondition"), "purple-passion");
    let mapChartInstance = null;
    // 获取地图容器  
    // let charts = myEcharts.init(document.querySelector(`#china`));

    let mapChart = document.getElementById("china");
    mapChartInstance = markRaw(
        echarts.init(mapChart, undefined, { devicePixelRatio: 2, renderer: "svg" })
    );
    // 注册地图
    echarts.registerMap("China", China);
    mapChartInstance.setOption({
        // title: {
        //     text: "用户地域分布",
        //     left: 10,
        //     top: 10,
        //     textStyle: {
        //         color: "#000",
        //         fontSize: 16,
        //     },
        // },
        visualMap: {
            show: false,
            min: 0,
            max: 10000,
            type: "piecewise",
            right: 50,
            bottom: 20,
            inRange: {
                //控制颜色深浅
                opacity: 1,
            },
            pieces: [
                // 自定义每一段的范围，以及每一段的文字
                { gte: 99999, color: "#fc5531" },
                { gte: 50, lte: 1000, color: "#EC898D" },
                { gte: 20, lte: 50, color: "#8087E7" },
                { gte: 11, lte: 20, color: "#7FA6E1" },
                { gte: 6, lte: 10, color: "#89DDE0" },
                { lte: 1, lte: 5, color: "#B6CFEB" },
                // { gte: 50, color: "#E68186" },
                // { gte: 20, lte: 50, color: "#EDADAD" },
                // { gte: 1, lte: 20, color: "#FBE2E3" },
            ],
            zlevel: 1
        },
        series: [
            {
                name: "中华人民共和国",
                type: "map",
                map: 'China',
                geoIndex: 0,
                //假数据
                data: custSpreadData.value.mapData,
                label: {
                    show: false
                },
            },
        ],
        tooltip: {
            // 自定义弹窗
            // 鼠标引入省份,不断触发.params 对象.当前省份的信息.
            formatter: function (params) {
                // console.log(params);
                // return params.seriesName + "<br>" + params.name + ":" + (params.value || 0) + "个";
                return params.seriesName + "<br>" + params.name + ":" + (params.data.showValue || 0) + "个";
            },
        },
        geo: {
            // 使用地图
            map: "China",
            label: {
                //显示地域标签  
                show: false,
                //标签字体颜色  
                color: "#ffffff",
            },
            layoutCenter: ["50%", "70%"],
            // layoutCenter: ["50%", "60%"],
            //地图尺寸
            layoutSize: "160%",
            // layoutSize: "120%",
            // 缩放  
            aspectScale: 1,
            itemStyle: {
                //区域边框宽度  
                borderWidth: 0.5,
                //区域边框颜色  
                borderColor: "#fff",
                //区域颜色  
                areaColor: "#F2F2F2",
            },
            emphasis: {
                // 鼠标悬浮效果
                itemStyle: {
                    // borderWidth: 0.5,
                    // borderColor: "#33ddff",
                    // areaColor: "#26627f",
                },
                label: {
                    //对应的鼠标悬浮效果
                    show: true,
                    color: "#ffffff",
                },
            },
            regions: selectRegions.value,
            // [
            //     {
            //         name:"甘肃省",
            //         itemStyle:{
            //             areaColor: "#Fae06d"
            //         }
            //     }
            // ]
            zlevel: 99
        },
    });




    // let charts = myEcharts.init(document.querySelector(`#china`));
    //  charts.setOption({
    //    backgroundColor: "#FFFFFF",
    //    title: {
    //      text: "",
    //      subtext: "",
    //      x: "center"
    //    },
    //    tooltip: {
    //      trigger: "item"
    //    },

    //    //左侧小导航图标
    //    visualMap: {
    //      min: 0,
    //      max: 600,
    //      text: ["高", "低"],
    //      inRange: {
    //        color: ["#D8FAFE", "#006EDD"]   //此处是设置颜色过渡
    //      }
    //    },

    //    //配置属性
    //    series: [
    //      {
    //        name: "报名人数",
    //        type: "map",
    //        mapType: "china",  //---此处是中国地图样式-------需要注意：省份中应使用汉字即如 ‘mapType:"河南"’
    //        roam: true,
    //        label: {
    //          normal: {
    //            show: false //省份名称----你可以选择true，展示每个省份的名称
    //          },
    //          emphasis: {
    //            show: false
    //          }
    //        },
    //        data: [//这是数据，500以内的随机数
    //          { name: "北京", value: "100" },
    //          { name: "天津", value: Math.round(Math.random() * 500) },
    //          { name: "上海", value: Math.round(Math.random() * 500) },
    //          { name: "重庆", value: Math.round(Math.random() * 500) },
    //          { name: "河北", value: Math.round(Math.random() * 500) },
    //          { name: "河南", value: Math.round(Math.random() * 500) },
    //          { name: "云南", value: Math.round(Math.random() * 500) },
    //          { name: "辽宁", value: Math.round(Math.random() * 500) },
    //          { name: "黑龙江", value: Math.round(Math.random() * 500) },
    //          { name: "湖南", value: Math.round(Math.random() * 500) },
    //          { name: "安徽", value: Math.round(Math.random() * 500) },
    //          { name: "山东", value: Math.round(Math.random() * 500) },
    //          { name: "新疆", value: Math.round(Math.random() * 500) },
    //          { name: "江苏", value: Math.round(Math.random() * 500) },
    //          { name: "浙江", value: Math.round(Math.random() * 500) },
    //          { name: "江西", value: Math.round(Math.random() * 500) },
    //          { name: "湖北", value: Math.round(Math.random() * 500) },
    //          { name: "广西", value: Math.round(Math.random() * 500) },
    //          { name: "甘肃", value: Math.round(Math.random() * 500) },
    //          { name: "山西", value: Math.round(Math.random() * 500) },
    //          { name: "内蒙古", value: Math.round(Math.random() * 500) },
    //          { name: "陕西", value: Math.round(Math.random() * 500) },
    //          { name: "吉林", value: Math.round(Math.random() * 500) },
    //          { name: "福建", value: Math.round(Math.random() * 500) },
    //          { name: "贵州", value: Math.round(Math.random() * 500) },
    //          { name: "广东", value: Math.round(Math.random() * 500) },
    //          { name: "青海", value: Math.round(Math.random() * 500) },
    //          { name: "西藏", value: Math.round(Math.random() * 500) },
    //          { name: "四川", value: Math.round(Math.random() * 500) },
    //          { name: "宁夏", value: Math.round(Math.random() * 500) },
    //          { name: "海南", value: Math.round(Math.random() * 500) },
    //          { name: "台湾", value: Math.round(Math.random() * 500) },
    //          { name: "香港", value: Math.round(Math.random() * 500) },
    //          { name: "澳门", value: Math.round(Math.random() * 500) }
    //        ] //数据
    //      }
    //    ]
    //  });
    //  window.addEventListener("resize", function() {
    //    charts.resize();
    //  });
}

//   // 客户分析
//   const CustomerAnalysis=()=>{
//       //  参考地址  https://blog.csdn.net/m0_65835778/article/details/128573786
//       let mapcharts = this.$echarts.init(this.$refs.customerAnalysisRef);
//       //窗口尺寸改变
//       window.addEventListener("resize", function () {
//         mapcharts.resize();
//       })

//       // 绘制图表
//       mapcharts.setOption({
//         series: [{
//           type: 'map',
//           map: 'china',
//           layoutCenter: ['50%', '50%'], // 地图布局中心点
//           // layoutSize: 290,
//           label: {
//             show: false,
//             color: '#ffffff',
//             fontSize: 10,
//           },
//           itemStyle: {
//             // areaColor: '#eee',
//             // borderColor: '#24dafe',
//             areaColor: '#ddd',
//             borderColor: '#24dafe',
//           },
//           roam: true,
//           zoom: 1.2,
//           emphasis: {
//             label: {
//               color: '#fff',
//               fontSize: 12,
//               fontWeight: 'bold'
//             },
//             itemStyle: {
//               areaColor: 'none',
//               borderColor: '#77ebff',
//               borderWidth: 2
//             }
//           },
//           data: this.customerAnalysisData,
//         }],
//         visualMap: [{
//           type: 'piecewise',
//           show: false, // 是否展示图例
//           pieces: [
//             { min: 0, max: 4 },
//             { min: 5, max: 9 },
//             { min: 10, max: 14 },
//             { min: 14 },
//           ],
//           textStyle: {
//             color: '#828994'
//           },
//           itemWidth: 64, // 每个图元的宽度
//           itemHeight: 12,
//           bottom: "top",
//           left: "0",
//           inRange: {
//             borderRadius: 4,
//             color: [
//               '#84bbff',
//               '#70b4ff',
//               '#61a7ff',
//               '#4d90f2',
//             ]
//           },
//         }],
//         tooltip: {
//           trigger: 'item',  //数据项图形触发
//           backgroundColor: "#fff",
//           borderWidth: 0,
//           // formatter: '地区：{b}<br/>数据：{c}'
//           formatter: function (e, t, n) {
//             if (e && e.data && e.data.name) {
//               let res = e.name + '<br/>'
//               let datas = e.data.custArr
//               for (let i = 0, length = datas.length; i < length; i++) {
//                 res += datas[i].label + '：'
//                   + datas[i].value + '吨<br/>'
//               }
//               return res
//             } else {
//               return e.name
//             }
//           },
//         },
//         // 保存和刷新
//         // toolbox: {
//         //   show: true,
//         //   orient: 'vertical',
//         //   left: 'right',
//         //   bottom: '0',
//         //   feature: {
//         //     restore: {},
//         //     saveAsImage: {}
//         //   }
//         // },
//       })

//     }

onUnmounted(() => {
    timer.value = null
})

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
        margin-bottom: 10px;

        &-top {
            display: grid;
            grid-template-columns: repeat(6, calc(16.5% - 10px));
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

    .material {
        margin-top: 10px;

        &-main {
            display: grid;
            grid-template-columns: calc(24% - 20px) calc(34% - 20px) calc(42% - 20px);
            grid-column-gap: 20px;

            &-leftCard {
                // background: linear-gradient(to right bottom, #E9EFFD, #F6FAFF);

                background: url("@/assets/images/WZC/material1.png") no-repeat center center;
                background-size: cover;

                padding: 20px;
                border-radius: 10px;

                display: flex;
                justify-content: space-between;
                align-items: end;

                &-title {
                    font-size: 15px;
                    font-weight: bold;
                    color: #2259C6;
                }

                &-num {
                    font-size: 35px;
                    font-weight: bold;
                    color: #020435;
                }

                &-info {
                    margin-top: 10px;
                    font-size: 15px;
                    font-weight: 500;
                    color: #272727;
                }
            }

            &-leftCard2 {
                background: url("@/assets/images/WZC/material2.png") no-repeat center center;

                .material-main-leftCard-title {
                    color: #376577 !important;
                }
            }
        }

        &-img {
            width: 70px;
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
        margin-bottom: 20px;

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


}
</style>