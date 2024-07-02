<!-- 竞价大厅 -->
<template>
  <div class="manual-app">
    <el-row>
      <el-col :span="5">
        <el-card class="box-card">
          <div>
            <el-tabs v-model="queryLeftForm.BILLSTATUS" class="demo-tabs" @tab-change="handleClick">
              <el-tab-pane :label="`已报名(${quantityData.SIGNCOUNT || 0})`" name="3,4"
                v-if="userInfo.USERTYPE == 2"></el-tab-pane>
              <!-- <el-tab-pane :label="`报名中(${quantityData.SIGNCOUNT || 0})`" name="3" v-else-if="userInfo.USERTYPE !=0 "></el-tab-pane> -->
              <el-tab-pane :label="`竞价中(${quantityData.BIDCOUNT || 0})`" name="5"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="mb10 disflex ">
            <el-input size="default" v-model="queryLeftForm.KEYWORD" placeholder="请输入关键词查询" :prefix-icon="Search"
              clearable />
            <el-divider direction="vertical" />
            <el-button text @click="clickLeftBtn">查询</el-button>
          </div>
          <el-scrollbar :height="leftHight">
            <div v-for="(item, index) in leftMenuList" :key="index" class="leftMenu"
              :class="{ 'active': menuVal == item.BILLNO }" @click="chooeseMune(item)">
              <div class="leftMenu-alone disflex justify-sb ">
                <div class="leftMenu-title">
                  <TextOverflow :content="item.VNAME" />
                </div>
                <!-- <div class="leftMenu-status" :class="`leftMenu-status${item.BILLSTATUS}`">{{
        statusList[item.BILLSTATUS] }}</div> -->
              </div>
              <div class="leftMenu-content">报名截止时间：{{ item.SIGNENDTIME }}</div>
              <div class="leftMenu-content">竞价开始时间：{{ item.BIDSTARTTIME }}</div>
              <div class="leftMenu-content">竞价截止时间：{{ item.BIDENDTIME }}</div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="19">

        <el-card class="box-card">
          <el-scrollbar :height="Hight">
            <div class="card-header" v-if="userInfo.USERTYPE == 0">
              <div>
                <div class="disflex">
                  <div class="card-header-title">{{ detailNoDynamic.VNAME }}</div>
                </div>
              </div>
              <div class="disflex">
                <div class="disflex">
                  <div class="card-header-tag">
                    <div class="card-header-tag-text">
                      {{ BILLSTATUSList[bidInfo.BILLSTATUS] || '暂无状态' }}
                    </div>
                  </div>
                  <!-- <countDown ref="countDownRef" v-if="bidInfo.BILLSTATUS == 5" :time="bidInfo.BIDENDTIME" /> -->
                  <countDown ref="countDownRef"
                    v-if="bidInfo.BILLSTATUS == 5 || bidInfo.BILLSTATUS == 4 || bidInfo.BILLSTATUS == 3"
                    :time="bidInfo.COUNTDOWNTIMESTAMP" />
                </div>
              </div>
            </div>
            <div class="card-header" v-else-if="userInfo.USERTYPE == 2">
              <div>
                <div class="disflex">

                  <div class="card-header-title" :style="{
        maxWidth: bidInfo.BILLSTATUS == 5 ? '370px' : '500px'

      }">{{ detailNoDynamic.VNAME }}</div>
                  <div class="disflex">
                    <div class="card-header-tag">
                      <div class="card-header-tag-text">
                        {{ BILLSTATUSList[bidInfo.BILLSTATUS] || '暂无状态' }}
                      </div>
                    </div>
                    <countDown ref="countDownRef"
                      v-if="bidInfo.BILLSTATUS == 5 || bidInfo.BILLSTATUS == 4 || bidInfo.BILLSTATUS == 3"
                      :time="bidInfo.COUNTDOWNTIMESTAMP" />
                  </div>
                </div>
              </div>
              <div class="disflex" v-if="bidInfo.BILLSTATUS == 5" style="flex-shrink:0">
                <div class="mr-10">
                  <el-form ref="ruleFormRef" :model="ruleForm" label-width="50px" class="demo-ruleForm" size='small'
                    status-icon>
                    <el-form-item label="出价" prop="name">
                      <el-input v-model="ruleForm.BIDPRICE" style="width: 120px;" type="number"
                        @blur="priceBlur(2, 'BIDPRICE')">
                        <template #append>元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="出量" prop="desc" class="noMargin" v-if="detailNoDynamic.ISEXPECTTYPE == 1">
                      <el-input v-model="ruleForm.EXPECTVALUE" style="width: 120px;" type="number"
                        @blur="priceBlur(0, 'EXPECTVALUE')">
                        <template #append>{{ detailNoDynamic.TRANSUNITSTUNIT }}</template>
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="degree" @click="clickBidPrice">
                  <div>出价</div>
                  <div v-if="detailNoDynamic.BIDTYPE == 1 || detailNoDynamic.BIDTYPE == 0">
                    <span v-if="bidInfo.REMAINNUM == '不限制'">({{ bidInfo.REMAINNUM }})</span>
                    <span v-else>(剩余{{ bidInfo.REMAINNUM }}次)</span>
                  </div>
                </div>
              </div>
            </div>

            <el-collapse v-model="activeName" class="">
              <el-collapse-item name="1">
                <template #title>
                  <div class="commonSmallTitle">竞价信息</div>
                </template>
                <div>
                  <div class="cargoInfo">

                    <div class="cargoInfo-top">
                      <div class="disflex justify-sb ">
                        <div class="disflex mr-30">
                          <div class="cargoInfo-top-start">装</div>
                          <div class="">
                            <div class="cargoInfo-top-startTitle">
                              {{ detailNoDynamic.SENDAREASHENG }}
                              {{ detailNoDynamic.SENDAREASHI }}</div>
                            <div class="cargoInfo-top-describe">
                              {{ detailNoDynamic.SENDAREASHI }}
                              {{ detailNoDynamic.SENDAREAQU }}
                              {{ detailNoDynamic.SENDCOMPANY }}
                            </div>
                          </div>
                        </div>
                        <div class="cargoInfo-top-line mr-30">
                          {{ detailNoDynamic.MILEAGE }} KM
                        </div>
                        <div class="disflex">
                          <div class="cargoInfo-top-end">卸</div>
                          <div class="">
                            <div class="cargoInfo-top-endTitle">
                              {{ detailNoDynamic.RECVAREASHENG }}
                              {{ detailNoDynamic.RECVAREASHI }}
                            </div>
                            <div class="cargoInfo-top-describe">
                              {{ detailNoDynamic.RECVAREASHI }}
                              {{ detailNoDynamic.RECVAREAQU }}
                              {{ detailNoDynamic.RECVCOMPANY }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="disflex justify-sb">
                        <div class="disflex mr-20">
                          竞价运费 <span class="cargoInfo-top-num">{{ detailNoDynamic.BIDFLOORPRICE }}
                            元</span>
                        </div>
                        <div class="disflex">
                          保证金 <span class="cargoInfo-top-num">{{ detailNoDynamic.DEPOSITAMT }}
                            元</span>
                        </div>
                      </div>
                    </div>
                    <div class="disflex flex-w mt10">
                      <div v-for="(item, index) in cargoInfoList" :key="index" class="disflex mr-20 mb-5">
                        <div class="">{{ item.title }}</div>
                        <div v-if="item.flag">
                          <div v-if="item.flag == 'select'" class="cargoInfo-top-content">
                            {{ computedCargoInfoSelect(item.selectList,
        detailNoDynamic[item.text]) }}
                          </div>
                          <div class="cargoInfo-top-content" v-else-if="item.flag == 'sub'">
                            <span v-for="item in computedSub(detailNoDynamic.SUBLIST)" :key="item">{{ item
                              }}</span>
                            <!-- {{ computedSub(detailNoDynamic.SUBLIST) }} -->
                          </div>
                          <div class="cargoInfo-top-content" v-else-if="item.flag == 'joint'">
                            {{ detailNoDynamic.CARMINLENGTH }}*{{ detailNoDynamic.CARMINWIDTH
                            }}*{{
        detailNoDynamic.CARMINHEIGHT }}
                          </div>
                          <div v-if="item.flag == 'exNum'" class="cargoInfo-top-content">
                            {{ computedCargoInfoExNum(item.selectList,
        detailNoDynamic[item.text]) }}
                          </div>
                        </div>
                        <div v-else class="cargoInfo-top-content">{{ detailNoDynamic[item.text] }}
                        </div>
                        <div v-if="item.unit">{{ item.unit }}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </el-collapse-item>
              <el-collapse-item name="2" v-if="detailNoDynamic.WINASSIGNTYPE == 0 || detailNoDynamic.WINASSIGNTYPE == 1">
                <template #title>
                  <div class="commonSmallTitle mt10" v-if="detailNoDynamic.WINASSIGNTYPE == 0 || detailNoDynamic.WINASSIGNTYPE == 1">
                    中标分配:{{ detailNoDynamic.WINASSIGNTYPE == 1?'人工预置':detailNoDynamic.WINASSIGNTYPE == 0?'平均分配':'' }}
                  </div>
                </template>
                <!-- <div class="winBidding mt-10" v-if="detailNoDynamic.WINASSIGNTYPE == 1"> -->
                <!-- <template v-for="(item, index) in winBiddingList" :key="index">
                    <div class="winBidding-alone disflex justify-sb" v-if="detailNoDynamic.WINNUM > index">
                      <div class="mr10 disflex" style="flex-shrink: 0;">
                        <div class="winBidding-icon" :class="item.colorClass">{{ index + 1 }}
                        </div>
                        {{ item.title }}
                      </div>
                      <div class="winBidding-alone-num disflex" :class="item.colorClass">
                        <div>{{ detailNoDynamic[item.num] }}</div>
                        <div class="winBidding-alone-num-symbol">%</div>
                      </div>
                    </div>
                  </template> -->
                <div class="mt-10" v-if="detailNoDynamic.WINASSIGNTYPE == 0 || detailNoDynamic.WINASSIGNTYPE == 1">
                  <el-table :data="fplList.INFO" style="width: 100%">
                    <el-table-column prop="TITLE" />
                    <el-table-column prop="A" v-if="fplList.TITLE.A" :label='fplList.TITLE.A' />
                    <el-table-column prop="B" v-if="fplList.TITLE.B" :label='fplList.TITLE.B' />
                    <el-table-column prop="C" v-if="fplList.TITLE.C" :label='fplList.TITLE.C' />
                    <el-table-column prop="D" v-if="fplList.TITLE.D" :label='fplList.TITLE.D' />
                    <el-table-column prop="E" v-if="fplList.TITLE.E" :label='fplList.TITLE.E' />
                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div class="commonSmallTitle mt-10 disflex justify-sb">
              <div class="disflex card-header">
                <div class="mr-20">出价信息</div>
                <div class="disflex">
                  <div class="RoundBid">{{ detailNoDynamic.BIDTYPE == 1 ? '自由出价' : detailNoDynamic.BIDTYPE
        ==
        2 ? '公开竞价' : '轮次出价' }}</div>
                  <div class="currentRound" v-if="detailNoDynamic.BIDTYPE == 0">当前轮次：<span class="currentRound-num">{{
        detailNoDynamic.ROUNDNUM
      }}次</span> </div>
                </div>

              </div>
              <div class="winBidding-topRight disflex">
                <div>在线人数</div>
                <div class="winBidding-topRight-num mr-10">{{ bidInfo.SIGNCOUNT }}个</div>

                <div>报名单位</div>
                <div class="winBidding-topRight-num mr-10">{{ bidInfo.SIGNCOUNT }}个</div>

                <div>出价单位</div>
                <div class="winBidding-topRight-num mr-10">{{ bidInfo.COMPANYCOUNT }}个</div>

                <div>出价次数</div>
                <div class="winBidding-topRight-num mr-10">{{ bidInfo.RECORDCOUNT }}次</div>

                <div v-if="userInfo.USERTYPE == 2 && bidInfo.CARRIERVISITRANK == 1">出价排名</div>
                <div v-if="userInfo.USERTYPE == 2 && bidInfo.CARRIERVISITRANK == 1"
                  class="winBidding-topRight-num mr-10">{{
        bidInfo.CHINESERANK }}</div>

              </div>
            </div>
            <div v-if="detailNoDynamic.BIDTYPE == 0" class="mt-20 mb-10 flex-row-end ">
              <el-select v-model="ROUNDNUM" placeholder="请选择轮次" @change="changeROUNDNUM">
                <el-option v-for="item in Number(bidInfo.MAXROUNDNUM)" :key="item" :label="item" :value="item" />
              </el-select>
            </div>
            <div class="mt10">
              <el-table :data="bidInfo.SUBLIST" style="width: 100%">
                <el-table-column prop="BIDDERNAME" label="出价单位" width="180" />
                <el-table-column prop="BIDPRICE" label="出价金额" />
                <el-table-column prop="IPADDRESS" label="IP地址" />
                <el-table-column prop="BIDADDRESS" label="定位信息" />
                <el-table-column prop="BIDDATE" label="出价时间" />
                <el-table-column prop="BILLSTATUS" label="状态">
                  <template #default="scope">
                    {{ scope.row.BILLSTATUS == 1 ? '有效' : '无效' }}
                  </template>
                </el-table-column>
                <!-- <el-table-column v-if="userInfo.USERTYPE == 0" prop="RANKNUMBER" label="名次" /> -->
              </el-table>
            </div>
            <!-- <el-scrollbar :height="Hight">
                        <el-container>
                            <el-main>
                            </el-main>
                        </el-container>
                    </el-scrollbar> -->
          </el-scrollbar>

        </el-card>
        <!-- </el-scrollbar> -->

      </el-col>
    </el-row>
  </div>
</template>

<script setup>
const sideIndex = ref();

const leftHight = window.innerHeight - 240;
const Hight = window.innerHeight - 154;
const { proxy } = getCurrentInstance();

import { onMounted, onUnmounted, ref, onUpdated, onBeforeUpdate } from "vue";

import { Search } from "@element-plus/icons-vue";
import { getGfLeftList, getGfRightList } from "#/system/log";
import { computed } from "@vue/runtime-core";
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";
import biddingHall1 from "@/assets/images/WZC/biddingHall1.png";
import biddingHall2 from "@/assets/images/WZC/biddingHall2.png";
import biddingHall3 from "@/assets/images/WZC/biddingHall3.png";
import countDown from "@/components/countDown/index";

import axios from "axios";

const route = useRoute();
const searchValue = ref("");
// const textContent = ref("");
// const Description = ref("");
// const vname = ref("");
const ruleForm = ref({
  BIDPRICE: null,
  EXPECTVALUE: null,
  BIDADDRESS: null,
});
import TextOverflow from "@/components/TextOverflow"
const { BILLINGMODEL } = proxy.useDict("BILLINGMODEL")

// const titleIndex = ref(0);
import useUserStore from "@/store/modules/user";

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);
// BILLSTATUS 项目状态0-未开始 1-待发公告 2-待报名 3-报名中 4-待竞价 5-竞价中 6-竞价结束

const statusList = ref(['未开始', '待发公告', '待报名', '报名中', '待竞价', '竞价中', '竞价结束'])

const computedCargoInfoSelect = computed((list, val) => {
  return (list, val) => {
    console.log("🚀 ~ return ~ list, val:", list, val)
    if (!list || !val) return "暂无数据";
    // console.log(detailNoDynamic.value.WINNUM)
    for (const key in list) {
      if (val == key) {
        return list[key];
      }
    }
    return "暂无数据";

    // let obj = list.filter(ele => ele.value == val)[0]
    // return obj?.value || '暂无数据'
  };
});


const computedCargoInfoExNum = computed((list, val) => {
  return (list, val) => {
    if (!list || !val) return "暂无数据";
    let arr = list.filter(ele => ele.VALUE == val)
    if (arr.length) {
      return arr[0].LABEL;
    }
    return "暂无数据";
  };
});


const computedSub = computed((list) => {
  return (list) => {
    if (!list) return "暂无数据";
    let arr = [];
    list.forEach((item) => {
      let str = item.MATERIALNAME.concat(
        ` | ${item.ORDERNUM} | ${item.TRANSUNIT}`
      );
      arr.push(str);
    });
    return arr || [];
  };
});

// const nextTitle = computed(() => {
//     if (titleIndex.value == options.value.length - 1) return "";
//     vname.value = options.value[titleIndex.value]["TITLE"];
//     return options.value[titleIndex.value + 1]["TITLE"];
// });

const activeName = ref(["1"]);
console.log("🚀 ~ BILLINGMODEL.value:", BILLINGMODEL.value)

const brandModelList = ref([]);
const WINNUMList = ref([]);
const cargoInfoList = ref([
  {
    title: "竞价时间：",
    text: "BIDSTARTTIME",
  },
  {
    title: "降价幅度：",
    text: "PRICECUT",
    unit: '元'
  },
  {
    title: "计费模式：",
    text: "BILLINGMODEL",
    flag: "exNum",
    selectList: BILLINGMODEL.value,
  },
  {
    title: "参考价：",
    text: "REFERENCEPRICE",
  },
  // {
  //     title: '结算组织：',
  //     text: '竞价时间',
  // },
  {
    title: "运输货物：",
    flag: "sub",
  },
  {
    title: "车辆要求：",
    flag: "joint",
  },
  {
    title: "车型要求：",
    text: "CARTYPEREQUIE",
    // flag: 'select',
    // selectList: brandModelList
  },
  {
    title: "要求发货时间：",
    text: "REQSTARTTIME",
  },
  {
    title: "要求送达时间：",
    text: "REQENDTIME",
  },
  {
    title: "中标名次：",
    text: "WINNUM",
    flag: "select",
    selectList: WINNUMList,
  },
]);
const winBiddingList = ref([
  {
    title: "第一名分配",
    num: "ONEPRESENDCARNUM",
    img: biddingHall1,
  },
  {
    title: "第二名分配",
    num: "TWOPRESENDCARNUM",
    img: biddingHall2,
    colorClass: "two",
  },
  {
    title: "第三名分配",
    num: "THREEPRESENDCARNUM",
    img: biddingHall3,
    colorClass: "tree",
  },
  {
    title: "第四名分配",
    num: "FOURPRESENDCARNUM",
    img: biddingHall3,
    colorClass: "four",
  },
  {
    title: "第五名分配",
    num: "FIVEPRESENDCARNUM",
    img: biddingHall3,
    colorClass: "five",
  },
]);
// 0-未开始 1-待发公告 2-待报名 3-报名中 4-待竞价 5-竞价中 6-竞价结束 7-竞价完
const BILLSTATUSList = ref([
  "未开始",
  "待发公告",
  "待报名",
  "报名中",
  "待竞价",
  "竞价中",
  "竞价结束",
  "竞价完",
]);
const leftMenuList = ref([]);
const timer = ref(null);
const count = ref(0);

onMounted(() => {
  getPageList();
  getProjectStatusCount()
  queryShowList("brandModel");
  queryShowList("WINNUM");
  if (userInfo.value.USERTYPE == 2) {
    queryPosition();
  }
});

const priceBlur = (num, field) => {
  ruleForm.value[field] = Number(ruleForm.value[field]).toFixed(num);
};

const menuVal = ref(null);
const leftMenuTotal = ref(0)
const queryLeftForm = ref({
  BILLSTATUS: userInfo.value.USERTYPE == 2 ? '3,4' : userInfo.value.USERTYPE != 0 ? '3' : '5',
  KEYWORD: ''
})
const handleClick = (e) => {
  queryLeftForm.value.KEYWORD = ''
  getPageList()
}
const clickLeftBtn = () => {
  getPageList()
}
const getPageList = () => {
  getTableData("oms/omsBidProject/getPageListNoDynamic", {
    PAGENUM: 1,
    PAGESIZE: 99,
    ...queryLeftForm.value
  }).then((res) => {
    // leftMenuTotal.value = res.RESULT.TOTAL
    leftMenuList.value = res.RESULT.RECORDS;
    if (leftMenuList.value.length) chooeseMune(leftMenuList.value[0]);
  });
};
const quantityData = ref({})
const getProjectStatusCount = () => {
  getTableData("oms/omsBidProject/getProjectStatusCount", {
  }).then((res) => {
    quantityData.value = res.RESULT
  });
}



const changeROUNDNUM = () => {
  clearInterval(timer.value);
  timer.value = null;
  bidInfo.value.BILLSTATUS = null;
  countDownRef.value ? countDownRef.value.countDownClearInterval() : "";
  getDetailNoDynamic();
  getPermissDetail();
}
const chooeseMune = (item) => {
  menuVal.value = item.BILLNO;
  ruleForm.value = {
    BIDPRICE: null,
    EXPECTVALUE: null,
    BIDADDRESS: null,
  };
  clearInterval(timer.value);
  timer.value = null;
  bidInfo.value.BILLSTATUS = null;
  countDownRef.value ? countDownRef.value.countDownClearInterval() : "";

  getDetailNoDynamic();
  getPermissDetail();
};
const detailNoDynamic = ref({});
const countDownRef = ref(null);
const ROUNDNUM = ref('')
const getDetailNoDynamic = () => {
  getTableData("oms/omsBidProject/getDetailNoDynamic", {
    BILLNO: menuVal.value,
    ROUNDNUM: String(ROUNDNUM.value),
  }).then((res) => {
    // countDownRef.value ? countDownRef.value.countDownClearInterval() : ''
    detailNoDynamic.value = res.RESULT;


    if (detailNoDynamic.value.WINASSIGNTYPE == 0 || detailNoDynamic.value.WINASSIGNTYPE == 1) {

      getBidResultAllocationList()

    }
  });
};

const fplList = ref({
  INFO: []
})
const getBidResultAllocationList = () => {
  getTableData("oms/omsBidProject/getBidResultAllocationList", {
    BILLNO: menuVal.value,
  }).then((res) => {
    // countDownRef.value ? countDownRef.value.countDownClearInterval() : ''
    fplList.value = res.RESULT;
  });
}



const bidInfo = ref({});
const getPermissDetail = () => {
  // countDownRef.value ? countDownRef.value.countDownClearInterval() : ''
  // bidInfo.value.BILLSTATUS = null
  // bidInfo.value.BIDENDTIME = null

  clearInterval(timer.value);
  count.value = 0;
  timer.value = null;

  getTableData("/oms/omsBidRecord/getPermissDetail", { BILLNO: menuVal.value, ROUNDNUM: String(ROUNDNUM.value) })
    .then((res) => {
      bidInfo.value = res.RESULT;
      count.value = 10;
      Verification();
    })
    .catch(() => {
      clearInterval(timer.value);
      count.value = 0;
      timer.value = null;
      bidInfo.value = {};
    });
};

const queryShowList = (dictCode) => {
  proxy
    .request({
      url: `/sys/dictDtl/queryDictByCode/${dictCode} `,
      method: "get",
      data: {
        // MODULEID: PK_MODULE,
        // PAGEID: PK_PAGE,
        // BILLNO: row.BILLNO
      },
    })
    .then(({ RESULT }) => {
      if (dictCode == "brandModel") {
        brandModelList.value = RESULT;
      } else if (dictCode == "WINNUM") {
        WINNUMList.value = RESULT;
      }
    });
};
const positionData = ref({});
const queryPosition = () => {
  axios
    .get("http://ip-api.com/json/?lang=zh-CN")
    .then((response) => {
      positionData.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const clickBidPrice = () => {
  getTableData("oms/omsBidRecord/bidPrice", {
    BILLNO: menuVal.value,
    BIDPRICE: ruleForm.value.BIDPRICE,
    EXPECTVALUE: ruleForm.value.EXPECTVALUE,
    BIDADDRESS: positionData.value.country + positionData.value.city,
    LAT: positionData.value.lat,
    LON: positionData.value.lon,
  }).then((res) => {
    ElMessage({
      message: "出价成功",
      type: "success",
    });
    ruleForm.value = {
      BIDPRICE: null,
      EXPECTVALUE: null,
      BIDADDRESS: null,
    };

    getPermissDetail();
    clearInterval(timer.value);
    timer.value = null;
  });
};

const Verification = () => {
  if (timer.value) return

  timer.value = setInterval(() => {
    if (count.value > 0 && count.value <= 10) {
      count.value--;
    } else if (count.value == 0) {
      getPermissDetail(); // 请求数据
      clearInterval(timer.value);
      timer.value = null;
    }
  }, 1000);
};

onUnmounted(() => {
  console.log("竞价离开视线");
  clearInterval(timer.value);
  timer.value = null;
});
</script>

<style lang="scss" scoped>
.disflex {
  display: flex;
  align-items: center;
}

.align-s {
  align-items: start;
}

.align-e {
  align-items: end;
}

.justify-sb {
  justify-content: space-between;
}

.flex-w {
  flex-wrap: wrap;
}

.mt-10 {
  margin-top: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.mt-30 {
  margin-top: 30px;
}

.mr-20 {
  margin-right: 20px;
}

.mr-30 {
  margin-right: 30px;
}

.mr-10 {
  margin-right: 10px;
}

.mb-5 {
  margin-bottom: 5px;
}

.manual-app {

  // margin-top: 6px;
  .el-col-5 {
    padding: 0px !important;
    // height: 620px;
    float: left;
    display: block;
    box-sizing: border-box;

    .box-card {
      width: 100%;

      .card-header {
        font-size: 18px;
        font-weight: 500;
        color: #292929;
        margin-bottom: 10px;
      }

      .leftMenu {
        // padding: 4px 6px;
        // font-size: 14px;
        // font-weight: 500;
        // color: rgba(41, 41, 41, 0.75);
        // margin: 2px 0;
        cursor: pointer;
        border-radius: 2px;
        border: 1px solid #C4C4C4;

        margin-bottom: 20px;
        padding: 10px;

        &-title {
          font-weight: 500;
          font-size: 16px;
          color: #2E2E2E;
          width: 100%;
          // width: calc(100% - 42px);
        }

        &-content {
          font-weight: 400;
          font-size: 12px;
          color: #5A5A5A;
        }

        &.active {
          // background-color: #f1f6ff;
          // font-size: 14px;
          // font-weight: 500;
          // color: #1964f8;

          background: #F7F9FC;
          box-shadow: 0px 4px 10px 0px rgba(12, 47, 115, 0.14);
          border: 1px solid #1964F8;
        }

        &-alone {}

        &-status {
          font-weight: 400;
          font-size: 14px;
        }

        &-status0 {
          color: #29AE9C;
        }

        &-status1 {
          color: #29AE9C;
        }

        &-status2 {
          color: #29AE9C;
        }

        &-status3 {
          color: #1964F8;
        }

        &-status4 {
          color: #1964F8;
        }

        &-status5 {
          color: #FBAE15;
        }

        &-status6 {
          color: #E41919;
        }


      }
    }
  }

  .el-col-19 {
    padding: 0px 0px 0px 5px !important;

    .box-card {
      width: 100%;

      .commonSmallTitle {
        font-size: 18px;
        font-weight: 500;
        color: rgba(42, 43, 45, 0.82);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-title {
          font-size: 22px;
          font-weight: bold;
          color: #1a1a1a;
          margin-right: 30px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          // width: 270px;
          // max-width: 270px;
        }

        &-tag {
          color: #fff;
          width: 88px;
          height: 30px;
          // background: #E26D52;
          background: linear-gradient(to right bottom, #ed7d5a, #fcaa7d);
          transform: skewX(-25deg);
          position: relative;
          text-align: center;
          line-height: 30px;
          margin-right: 20px;

          &-text {
            transform: skewX(25deg);
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
          }
        }

        .RoundBid {
          width: 81px;
          height: 29px;
          border: 1px solid #1964f8;
          border-radius: 2px;
          font-size: 14px;
          font-weight: 500;
          color: #1964f8;
          text-align: center;
          line-height: 27px;
          margin-right: 20px;
        }

        .currentRound {
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;

          &-num {
            font-size: 16px;
            color: #686868;
          }
        }

        .noMargin {
          &.el-form-item {
            margin-bottom: 0 !important;
          }
        }

        .degree {
          // width: 136px;
          width: 100px;
          height: 62px;
          background: #1964f8;
          border-radius: 4px;

          font-size: 16px;
          font-weight: bold;
          color: #ffffff;
          text-align: center;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .endRange {
          font-size: 20px;
          font-weight: 500;
          color: #dd593b;
        }
      }

      .cargoInfo {
        background: rgba(239, 242, 247, 0.5);
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        color: #2a2b2d;
        padding: 10px;

        &-top {
          display: flex;
          justify-content: space-between;

          &-start {
            width: 38px;
            height: 38px;
            background: #1964f8;
            border-radius: 50%;

            font-size: 18px;
            font-weight: 500;
            color: #ffffff;
            text-align: center;
            line-height: 38px;
            margin-right: 5px;
          }

          &-startTitle {
            font-size: 18px;
            font-weight: 500;
            color: #1964f8;
          }

          &-describe {
            font-size: 13px;
            font-weight: 500;
            color: #969696;
          }

          &-end {
            width: 38px;
            height: 38px;
            background: #e33644;
            border-radius: 50%;
            margin-right: 5px;

            font-size: 18px;
            font-weight: 500;
            color: #ffffff;
            text-align: center;
            line-height: 38px;
          }

          &-endTitle {
            font-size: 18px;
            font-weight: 500;
            color: #e33644;
          }

          &-num {
            font-size: 20px;
            font-weight: bold;
            color: #eb401e;
            margin-left: 10px;
          }

          &-line {
            font-size: 14px;
            font-weight: 500;
            color: #6d6d6d;
            border-bottom: 1px dashed #969696;
            padding-bottom: 10px;
            flex-shrink: 0;
          }

          &-content {
            font-size: 16px;
            color: #686868;
          }
        }
      }

      .winBidding {
        display: grid;
        grid-template-columns: repeat(5, calc(20% - 5px));
        grid-column-gap: 5px;

        height: 62px;
        line-height: 62px;

        &-img {
          width: 70px;
          // height: 45px;
        }

        &-icon {
          width: 22px;
          height: 22px;
          background: #f5ac10;
          border-radius: 50%;
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          line-height: 22px;
          margin-right: 4px;

          &.two {
            background: #788d9d;
          }

          &.tree {
            background: #d1a686;
          }

          &.four {
            background: #a2a2a2;
          }

          &.five {
            background: #a2a2a2;
          }
        }

        &-topRight {
          font-size: 12px;
          background: #ececec;
          border-radius: 2px;
          padding: 6px;
          font-weight: 500;
          color: rgba(42, 43, 45, 0.82);

          &-num {
            font-size: 16px;
            color: #1964f8;
          }
        }

        &-alone {
          padding: 0px 8px;
          background: rgba(239, 242, 247, 0.5);
          border-radius: 10px;
          font-size: 18px;
          font-weight: 400;
          color: #2a2b2d;

          &-num {
            font-size: 34px;
            font-weight: 500;
            color: #f5ac10;

            &-symbol {
              font-size: 18px;
              font-weight: 400;
            }

            &.two {
              color: #788d9d;
            }

            &.tree {
              color: #d1a686;
            }

            &.four {
              color: #a2a2a2;
            }

            &.five {
              color: #a2a2a2;
            }
          }
        }
      }
    }
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 10px;
  }
}
</style>
<!-- <style scoped>
.mytable-scrollbar ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

/*滚动条的轨道*/
.mytable-scrollbar ::-webkit-scrollbar-track {
    background-color: #ffffff;
}

/*滚动条里面的小方块，能向上向下移动*/
.mytable-scrollbar ::-webkit-scrollbar-thumb {
    background-color: #bfbfbf;
    border-radius: 5px;
    border: 1px solid #f1f1f1;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

.mytable-scrollbar ::-webkit-scrollbar-thumb:hover {
    background-color: #a8a8a8;
}

.mytable-scrollbar ::-webkit-scrollbar-thumb:active {
    background-color: #787878;
}

/*边角，即两个滚动条的交汇处*/
.mytable-scrollbar ::-webkit-scrollbar-corner {
    background-color: #ffffff;
}
</style> -->