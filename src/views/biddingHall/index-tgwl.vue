<!--
 * @Author: cc2049
 * @Date: 2024-03-26 10:43:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-27 17:24:21
 * @Description: 通钢物流·竞价大厅
-->
<!-- 竞价大厅 -->
<template>
  <div class="manual-app">
    <el-row>
      <el-col :span="4">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <div class="disflex">
                <img src="@/assets/img/dingdan.png" alt="" style=";height: 20px;" class="mr10">
                所有竞价
              </div>
            </div>
          </template>
          <el-scrollbar :height="leftHight">
            <div v-for="(item) in leftMenuList" :key="item.BILLNO" class="leftMenu   " :class="{ 'active': menuVal == item.BILLNO }" @click="chooeseMune(item)">
              <div class="disflex justify-sb">
                <div class="leftMenu-alone">
                  <!--  -->
                  <el-icon title="已报名且最低价" color="#dd593b" v-if="item.ISLOWESTPRICE==1">
                    <Discount />
                  </el-icon>
                  {{ item.VNAME }}
                </div>
                <el-icon v-show="menuVal == item.BILLNO">
                  <CaretRight />
                </el-icon>
              </div>
              <div class="desc">
                {{ item.DESCRIBE || '描述的简介' }}
              </div>

            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="20">
        
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

                   <countDown ref="countDownRef"
                    v-if="bidInfo.BILLSTATUS == 5 || bidInfo.BILLSTATUS == 4 || bidInfo.BILLSTATUS == 3"
                    :time="bidInfo.COUNTDOWNTIMESTAMP" :label=" bidInfo.BILLSTATUS ==4 ?'距开始' :'距结束' " />  
                </div>
              </div>
            </div>
            <div class="card-header" v-else-if="userInfo.USERTYPE == 2">
              <div>
                <div class="disflex">

                  <div class="card-header-title">{{ detailNoDynamic.VNAME }}</div>
                  <div class="disflex">
                    <div class="card-header-tag">
                      <div class="card-header-tag-text">
                        {{ BILLSTATUSList[bidInfo.BILLSTATUS] || '暂无状态' }}
                      </div>
                    </div>

                    <!-- <countDown ref="countDownRef" v-if="bidInfo.BILLSTATUS == 5" :time="bidInfo.BIDENDTIME" /> -->

                     <countDown ref="countDownRef"
                      v-if="bidInfo.BILLSTATUS == 5 || bidInfo.BILLSTATUS == 4 || bidInfo.BILLSTATUS == 3"
                      :time="bidInfo.COUNTDOWNTIMESTAMP" :label=" bidInfo.BILLSTATUS ==4 ?'距开始' :'距结束' " />
                  </div>
                </div>

              </div>
              <div class="disflex" v-if="bidInfo.BILLSTATUS == 5" style="flex-shrink:0">
                <div class="mr-10">
                  <el-form ref="ruleFormRef" :model="ruleForm" label-width="50px" class="demo-ruleForm" size='small' status-icon>
                    <el-form-item label="出价" prop="name">
                      <el-input v-model="ruleForm.BIDPRICE" :disabled="onlineUsers.COMPANYCOUNT < minOnlineCompanyCount" style="width: 120px;" type="number" @blur="priceBlur(3, 'BIDPRICE')">
                        <template #append>元</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="出量" prop="desc" class="noMargin" v-if="detailNoDynamic.ISEXPECTTYPE == 1">
                      <el-input v-model="ruleForm.EXPECTVALUE" style="width: 120px;" type="number" @blur="priceBlur(0, 'EXPECTVALUE')">
                        <template #append>{{ detailNoDynamic.TRANSUNITSTUNIT }}</template>
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="degree" @click="clickBidPrice" v-if=" onlineUsers.COMPANYCOUNT >= minOnlineCompanyCount || bidInfo.COMPANYCOUNT >= minOnlineCompanyCount ">
                  <div>出价</div>
                  <div v-if="detailNoDynamic.BIDTYPE == 1 || detailNoDynamic.BIDTYPE == 0">
                    <span v-if="bidInfo.REMAINNUM == '不限制'">({{ bidInfo.REMAINNUM }})</span>
                    <span v-else>(剩余{{ bidInfo.REMAINNUM }}次)</span>
                  </div>
                </div>

                <div class="degree bg-orange" @click="autoPrice" v-if=" onlineUsers.COMPANYCOUNT >= minOnlineCompanyCount ">
                  <div>自动报价</div>
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
                            <div class="cargoInfo-top-startTitle">{{
                                                            detailNoDynamic.SENDAREASHENG }}{{
        detailNoDynamic.SENDAREASHI }}</div>
                            <div class="cargoInfo-top-describe">{{ detailNoDynamic.SENDAREASHI
                                                        }}{{
    detailNoDynamic.SENDAREAQU }}{{ detailNoDynamic.SENDCOMPANY }}
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
                              {{ detailNoDynamic.RECVAREASHI}}
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
                          </div>
                          <div class="cargoInfo-top-content" v-else-if="item.flag == 'joint'">
                            {{ detailNoDynamic.CARMINLENGTH }}*{{ detailNoDynamic.CARMINWIDTH
                                                        }}*{{
    detailNoDynamic.CARMINHEIGHT }}
                          </div>
                        </div>
                        <div v-else class="cargoInfo-top-content">{{ detailNoDynamic[item.text] }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </el-collapse-item>
              <el-collapse-item name="2" v-if="detailNoDynamic.WINASSIGNTYPE == 1">
                <template #title>
                  <div class="commonSmallTitle mt10" v-if="detailNoDynamic.WINASSIGNTYPE == 1">
                    中标分配:人工预置
                  </div>
                </template>
                <div class="winBidding mt-10" v-if="detailNoDynamic.WINASSIGNTYPE == 1">
                  <template v-for="(item, index) in winBiddingList" :key="index">
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
                  </template>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div class="commonSmallTitle mt-10 disflex justify-sb">
              <div class="disflex card-header">
                <div class="mr-20">出价信息</div>
                <div class="disflex">
                  <!-- char           default '2'    not null comment '出价方式（0-按轮次出价、1-自由出价、2-公开竞价 -->
                  <div class="RoundBid">{{ detailNoDynamic.BIDTYPE == 1 ? '自由出价' : detailNoDynamic.BIDTYPE
                                        ==
                                        2 ? '公开竞价' : '轮次出价' }}</div>
                  <div class="currentRound">当前轮次：<span class="currentRound-num">{{
                                        detailNoDynamic.ROUNDNUM
                                    }}次</span> </div>
                </div>

              </div>
              <div class="winBidding-topRight disflex">
                <div>在线单位</div>
                <div class="winBidding-topRight-num mr-10">{{ onlineUsers.COMPANYCOUNT || 0 }}</div>
                <div>在线人数</div>
                <div class="winBidding-topRight-num mr-10">{{ onlineUsers.PERSONCOUNT || 0 }}</div>

                <div>报名单位</div>
                <div class="winBidding-topRight-num mr-10">{{ bidInfo.SIGNCOUNT }}</div>

                <div>出价单位</div>
                <div class="winBidding-topRight-num mr-10">{{ bidInfo.COMPANYCOUNT }}</div>

                <div>出价次数</div>
                <div class="winBidding-topRight-num mr-10">{{ bidInfo.RECORDCOUNT }}</div>

              </div>
            </div>
            <div class="mt10">
              <el-table :data="bidInfo.SUBLIST" style="width: 100%">
                <el-table-column type="index" width="50" />
                <el-table-column prop="BIDDERNAME" label="出价单位" width="180" />
                <el-table-column prop="BIDPRICE" label="出价金额" />
                <el-table-column v-if="userInfo.USERTYPE == 0" prop="IPADDRESS" label="IP地址" />
                <el-table-column v-if="userInfo.USERTYPE == 0" prop="BIDADDRESS" label="定位信息" />
                <el-table-column prop="BIDDATE" label="出价时间" />
                <el-table-column prop="BILLSTATUS" label="状态">
                  <template #default="scope">
                    {{ scope.row.BILLSTATUS == 1 ? '有效' : '无效' }}
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </el-scrollbar>

        </el-card>

      </el-col>
    </el-row>

    <!-- <el-button @click="initWebSocket">
      开启websorct
    </el-button> -->
  </div>
</template>
  
<script setup>
const sideIndex = ref();

const leftHight = window.innerHeight - 210;
const Hight = window.innerHeight - 154;
const { proxy } = getCurrentInstance();

import { onMounted, onUnmounted, ref, onUpdated, onBeforeUpdate } from "vue";

import { Search } from "@element-plus/icons-vue";
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
// const titleIndex = ref(0);
import useUserStore from "@/store/modules/user";

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);

const computedCargoInfoSelect = computed((list, val) => {
  return (list, val) => {
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
  },
  // {
  //   title: "参考价：",
  //   text: "REFERENCEPRICE",
  // },
  // {
  //     title: '结算组织：',
  //     text: '竞价时间',
  // },
  {
    title: "运输货物：",
    flag: "sub",
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
const getPageList = () => {
  getTableData("oms/omsBidProject/getPageListNoDynamic", {
    PAGENUM: 1,
    PAGESIZE: 99,
  }).then((res) => {
    leftMenuList.value = res.RESULT.RECORDS;
    if (leftMenuList.value.length) chooeseMune(leftMenuList.value[0]);
  });
};
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
const getDetailNoDynamic = () => {
  getTableData("oms/omsBidProject/getDetailNoDynamic", {
    BILLNO: menuVal.value,
  }).then((res) => {
    detailNoDynamic.value = res.RESULT;
  });
};

const autoPrice = () => {
  getTableData("oms/omsBidProjectDtl/autoBidPrice", {
    BILLNO: menuVal.value,
  }).then((res) => {
    let { RESULT } = res;
    ruleForm.value.BIDPRICE = RESULT;
    proxy.$modal.confirm("当前自动报价价格：" + RESULT).then(() => {
      clickBidPrice();
    });
  });
};

const bidInfo = ref({});
const getPermissDetail = () => {
  getTableData("/oms/omsBidRecord/getPermissDetail", { BILLNO: menuVal.value })
    .then((res) => {
      bidInfo.value = res.RESULT;
      count.value = 10;
      Verification();
    })
    .catch(() => {
      clearInterval(timer.value);
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

const minOnlineCompanyCount = ref(0);
const getSystemInfo = () => {
  let data = { MODULETYPE: "PCCONFIG", VTYPE: "minOnlineCompanyCount" };
  getTableData("/config/openGetConfigByKey/minOnlineCompanyCount", data).then(
    (res) => {
      if (res.RESULT) {
        minOnlineCompanyCount.value = res.RESULT.configvalue;
      }
      console.log("minOnlineCompanyCount", minOnlineCompanyCount.value);
    }
  );
};

getSystemInfo();

const Verification = () => {
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

// 身份证读卡功能

const websock = ref(null);
let websockStatus = false;
initWebSocket();
function initWebSocket(url) {
  //初始化weosocket
  //   const wsuri = "ws://121.37.86.183:8002/ws/imserver/10";
  let BaseHost = window.location.host;
  const wsuri = "ws://" + BaseHost + "/ws/bidSocket/" + userInfo.value.USERID;
  console.log("wsuri", wsuri);
  websock.value = new WebSocket(wsuri);
  websockStatus = websock.value.readyState == 1;
  websock.value.onopen = websocketonopen;
  websock.value.onmessage = websocketonmessage;
  websock.value.onerror = websocketonerror;
  websock.value.onclose = websocketclose;
}

// 定时循环调用传
const getUserNum = ref(null);
const timerLoop = (interval) => {
  function loop() {
    let actions = {
      projectId: detailNoDynamic.value.BILLNO,
      pkCompany: userInfo.value.PK_COMPANY,
      userId: userInfo.value.USERID,
    };
    websocketsend(JSON.stringify(actions));
  }
  let timerFun = setInterval(loop, interval * 1000); // 将间隔转换为毫秒
  return timerFun;
};
// 设置循环间隔时间（秒）
const interval = 5;
// 启动定时循环
// timerLoop(interval);
// 关闭定时循环
// clearInterval(timerLoop);

function websocketonopen() {
  //连接建立之后执行send方法发送数据
  if (websock.value.readyState) {
    getUserNum.value = timerLoop(interval);
  }
}
function websocketonerror() {
  //连接建立失败重连
  clearInterval(getUserNum.value);
  initWebSocket();
}

// 获取在线人数
const onlineUsers = ref(0);
function websocketonmessage(e) {
  const redata = JSON.parse(e.data);
  console.log(777, redata);
  onlineUsers.value = redata;
}
function websocketsend(Data) {
  //数据发送
  websock.value.send(Data);
}
function websocketclose(e) {
  //关闭
  console.log("断开连接", e);
  clearInterval(getUserNum.value);
  websock.value.close();
}

onUnmounted(() => {
  console.log("竞价离开视线");
  clearInterval(getUserNum.value);
  clearInterval(timer.value);
  timer.value = null;
  getUserNum.value = null;
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
  .el-col-4 {
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
        padding: 4px 6px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(41, 41, 41, 0.75);
        margin: 2px 0;
        cursor: pointer;

        &.active {
          background-color: #f1f6ff;
          font-size: 14px;
          font-weight: 500;
          color: var(--el-color-primary-light-4);
        }

        &-alone {
          font-weight: bold;
        }
      }
    }
  }

  .el-col-20 {
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
          max-width: 270px;
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
  