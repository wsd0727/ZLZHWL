<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" :loading="savaLoading" @click="submitPZ">提交</el-button>
  </teleport>
  <div class="app-wrap">
    <formGroup ref="formGroupRef" class="group" title="订单信息" v-model:visable="formOpen">
      <div class="group-content">
        <el-row class="content">
          <el-col :span="6" class="content-item">
            <div class="label">发货企业</div>
            <TextOverflow :content="orderData.SENDCOMPANY" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">发货地址</div>
            <TextOverflow :content="orderData.SENDADDRESS" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">收货企业</div>
            <TextOverflow :content="orderData.RECVCOMPANY" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">收货地址</div>
            <TextOverflow :content="orderData.RECVADDRESS" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">承运商</div>
            <TextOverflow :content="orderData.SHIPPERNAME" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">要求发货时间</div>
            <TextOverflow :content="orderData.STARTTIME" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">要求送达时间</div>
            <TextOverflow :content="orderData.ENDTIME" class="value" />
          </el-col>
          <el-col :span="6" class="content-item">
            <div class="label">装载方式</div>
            <div class="value">{{ selectDictLabel(loadmethod,orderData.LOADINGMETHOD) }}</div>
          </el-col>
        </el-row>
        <!-- 货物信息块  -->
        <template v-if="goodsList.length > 3">
          <miniTable height="186" :data="goodsList">
            <vxe-column field="MATERIALNAME" title="货物" min-width="200" align="left" fixed="left" show-overflow="tooltip" />
            <vxe-column field="MATSPEC" title="规格" min-width="150" align="left" show-overflow="tooltip" />
            <vxe-column field="RIGTAXPRICE" title="单价" align="right" width="120">
              <template #default="{row}">
                <div>{{row.RIGTAXPRICE}}元/{{row.NSUMUNIT}}</div>
              </template>
            </vxe-column>
            <vxe-column field="ENTRUSTNUM" title="委托量" align="right" width="120">
              <template #default="{row}">
                <div>{{row.ENTRUSTNUM}}{{row.NSUMUNIT}}</div>
              </template>
            </vxe-column>
            <vxe-column field="TRANSURPLUS" title="委托剩余量" align="right" width="120">
              <template #default="{row}">
                <div>{{row.TRANSURPLUS}}{{row.NSUMUNIT}}</div>
              </template>
            </vxe-column>
            <vxe-column field="name" title="委托进度" align="left" width="420">
              <template #default={row}>
                <el-progress :percentage="(Number(item.TRANSURPLUS) / Number(item.ENTRUSTNUM))*100" :format="()=>`委托量 ${row.ENTRUSTNUM}${row.NSUMUNIT}`" />
              </template>
            </vxe-column>
          </miniTable>
        </template>
        <template v-else>
          <ul class="goodsList">
            <li class="goodsList-item" v-for="(item, index) in goodsList" :key="index">
              <div class="head">
                <div class="title">
                  <span class="materiel">{{item.MATERIALNAME}}</span>
                  <div class="desc">{{item.MATSPEC}}</div>
                </div>
                <div class="price">{{item.RIGTAXPRICE}}元/{{item.NSUMUNIT}}</div>
              </div>
              <div class="line">
                <el-progress :percentage="(Number(item.TRANSURPLUS) / Number(item.ENTRUSTNUM))*100" :format="()=>`委托量 ${item.ENTRUSTNUM}${item.NSUMUNIT}`" />
              </div>
              <div class="surplus">委托剩余量 {{item.TRANSURPLUS}}{{item.NSUMUNIT}}</div>
            </li>
          </ul>
        </template>
      </div>
    </formGroup>

    <div class="group-form" :style="{height: `${listHeight}px`}">
      <div class="group-form-item">
        <div class="group">
          <div class="group-title">
            <div class="title">选择船舶</div>
          </div>
          <div class="group-content">
            <div class="query">
              <Form class="query-form" ref="formRefTop" label-width="50px" v-model:formData="queryForm" :formConfig="QueryConfig" inline @select="formSelect" @enter="queryEvent" />
              <el-button @click="queryEvent" type="primary" size="Default">查找</el-button>
            </div>
            <div class="table">
              <miniTable ref="tableRef" row-id="PK_DRIVER" :data="dataList" :height="miniTableHeight" show-overflow="tooltip" @change="AddPZ">
                <vxe-column type="checkbox" width="60" fixed="left" align="center"></vxe-column>
                <vxe-column field="VNAME" title="船名" align="center" min-width="100" fixed="left"></vxe-column>
                <vxe-column field="MANAGER" title="管理人" align="center" min-width="100"></vxe-column>
                <vxe-column field="TELEPHONE" title="电话" align="center" width="110"></vxe-column>
                <vxe-column field="SHIPSSTATUS" title="状态" align="center" width="100" sortable>
                  <template #default="{row}">
                    <div :class="row.SHIPSSTATUS !=0?'redColor':''">{{row.SHIPSSTATUS == '0'?'空闲':'占用'}}</div>
                  </template>
                </vxe-column>
                <vxe-column field="LOADWEIGHT" title="载重量(吨)" align="center" width="110"></vxe-column>
                <vxe-column field="DISPATCHTIME" title="最近一次委派时间" align="center" width="170"></vxe-column>
                <vxe-column field="name" title="拉运记录" align="center" width="90">
                  <template #default="{ rowIndex }">
                    <el-link type="primary" @click.stop="handleHistory(rowIndex)">查看</el-link>
                  </template>
                </vxe-column>
              </miniTable>
            </div>
            <div class="page">
              <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50, 100]" :current-page="pageInfo.currentPage" :total="Total" :layouts="['Total', 'PrevPage', 'JumpNumber', 'NextPage', 'Sizes']" @page-change="handlePageChange" />
            </div>
          </div>
        </div>
      </div>
      <div class="group-form-item">
        <div class="group">
          <div class="group-title">
            <div class="title">配载信息</div>
            <div class="pzinfo">已配载
              <p class="desc">
                <span class="number">{{PZList.length}}</span>船
                <span class="number">{{calcPZListNum}}</span>趟
              </p>
            </div>
          </div>
          <div class="group-content">
            <el-scrollbar :height="PZHeight" v-if="PZList.length > 0">
              <ul class="list">
                <li class="list-item" v-for="(item, index) in PZList" :key="index">
                  <div class="head">
                    <div class="title">
                      {{item.CARNO}}
                      <div class="hzINfo">
                        核载 <span v-if="item.LOADWEIGHT">{{item.LOADWEIGHT}}吨</span>
                      </div>
                    </div>
                    <div class="info del-icon" @click="PZDel(index)">
                      <el-icon>
                        <Close />
                      </el-icon>
                    </div>
                  </div>
                  <div class="content">
                    <Form ref="PZRef" v-model:formData="PZList[index]" label-width="72px" :formConfig="PZConfig" :rules="PZFormRules"></Form>
                    <div class="total">
                      <div class="info"></div>
                      <div class="btn"></div>
                    </div>
                    <miniTable v-if="orderData.LOADINGMETHOD != '1'" ref="PZTableRef" :min-height="40" :data="item.MATINFOS" :rules="PZTableRules">
                      <vxe-column field="MATERIALNAME" title="货物" min-width="30%" align="left" fixed="left" show-overflow="tooltip" />
                      <vxe-column field="MATSPEC" title="规格" min-width="30%" align="left" show-overflow="tooltip" />
                      <vxe-column field="ENTRUSTNUM" title="委托量" align="center" width="150">
                        <template #default="{row}">
                          <el-input v-model="row.ENTRUSTNUM" type="number">
                            <template #append>{{row.NSUMUNIT}}</template>
                          </el-input>
                        </template>
                      </vxe-column>
                      <vxe-column field="menu" title="操作" width="80" align="center">
                        <template #default="{rowIndex}">
                          <el-link v-if="item.MATINFOS && item.MATINFOS.length > 1" type="danger" @click="PZDelRow(index,rowIndex)">删除</el-link>
                        </template>
                      </vxe-column>
                    </miniTable>
                  </div>
                </li>
              </ul>
            </el-scrollbar>
            <div class="nodata" v-else>
              <img src="/src/assets/images/WZC/pz_nodata.png" />
              <p>您还未配载，请选择左侧列表数据添加配载</p>
            </div>
          </div>
        </div>
      </div>

      <vxe-modal destroy-on-close v-model="modelShow" width="60%" height="60%" id="FormModel" resize storage transfer show-zoom show-footer>
        <template #title>
          <span> {{ modeltitle }}的拉运记录 </span>
        </template>
        <template #default>
          <miniTable ref="modelTableRef" height="410px" :data="orderHistory">
            <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
            <vxe-column field="BILLNO" title="运单号" width="150" align="center" show-overflow="tooltip" />
            <vxe-column field="BILLSTATUS" title="状态" width="100" align="center" show-overflow="tooltip">
              <template #default="{row}">
                {{ selectDictLabel(shipsTsStatus,row.BILLSTATUS) }}
              </template>
            </vxe-column>
            <vxe-column field="CARNO" title="船舶" width="130" align="left" show-overflow="tooltip" />
            <vxe-column field="DRIVERNAME" title="管理人" width="130" align="left" show-overflow="tooltip" />
            <vxe-column field="LINENAME" title="线路" width="160" align="left" show-overflow="tooltip" />
            <vxe-column field="STARTTRANSPORTTIME" title="开启运输时间" width="160" align="center" show-overflow="tooltip" />
            <vxe-column field="SIGNTIME" title="签收确认时间" width="160" align="center" show-overflow="tooltip" />
          </miniTable>
          <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="modelPageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50]" :current-page="modelPageInfo.currentPage" :total="total" :layouts="['Total','PrevPage','JumpNumber','NextPage','Sizes',]" @page-change="modelPage" />
        </template>
        <template #footer>
          <el-button size="default" @click="modalClose">关闭</el-button>
        </template>
      </vxe-modal>
    </div>
  </div>
</template>

<script setup>
import Form from "@/components/Form";
import formGroup from "@/components/Form/formGroup";
import miniTable from "@/components/Tables/mini";
import { Search } from "@element-plus/icons-vue";
import { getWTOrderDetail, QueryConfig, getPZBoth, getOrderHistory, PZConfig, savePZ } from "#/WZC/Carrier/StowageBoat";
import { getFormRule } from "@/utils";
import TextOverflow from "@/components/TextOverflow";
import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
const systemConfig = computed(() => settingsStore.systemConfig);

const props = defineProps({
  currentData: String,
});
const emits = defineEmits(["close"]);

const BILLNO = computed(() => props.currentData[0].BILLNO || "");
const BUSSTYPE = computed(() => props.currentData[0].BUSSTYPE || "");


const { proxy } = getCurrentInstance();
const { shipsTsStatus, loadmethod } = proxy.useDict("shipsTsStatus", "loadmethod");
const formGroupRef = ref(null);
const tableRef = ref(null);
const listHeight = ref(0);
const miniTableHeight = ref(250);
const PZHeight = ref(300);

const formOpen = ref(true);
watch(formOpen, () => {
  nextTick(() => {
    listHeight.value = window.innerHeight - 170 - formGroupRef.value.$el.clientHeight;
    miniTableHeight.value = window.innerHeight - 300 - formGroupRef.value.$el.clientHeight;
    PZHeight.value = listHeight.value - 60;
  });
});

/** 订单信息 */
const orderData = ref({});
const goodsList = ref([]);
const getOrderData = () => {
  if (!BILLNO.value) return;
  getWTOrderDetail({
    BILLNO: BILLNO.value,
  }).then((res) => {
    orderData.value = res.RESULT;
    goodsList.value = res.RESULT.SUBLIST;
  }).finally(() => {
    nextTick(() => {
      listHeight.value = window.innerHeight - 170 - formGroupRef.value.$el.clientHeight;
      miniTableHeight.value = window.innerHeight - 350 - formGroupRef.value.$el.clientHeight;
      PZHeight.value = listHeight.value - 60;
    });
  });
};
getOrderData();

/** 选择数据列表 */
const queryForm = ref({
  VNAME: "",
  STATUS: ""
});
const pageInfo = reactive({
  pageSize: 10,
  currentPage: 1,
});
const tableKey = ref("PK_CAR");
const dataList = ref([]);
const Total = ref(0);
const getData = (marge = false) => {
  getPZBoth({
    PAGENUM: pageInfo.currentPage,
    PAGESIZE: pageInfo.pageSize,
    ...queryForm.value,
  }).then((res) => {
    dataList.value = res.RESULT.RECORDS;
    Total.value = res.RESULT.TOTAL;
    nextTick(() => {
      if (PZList.value.length) {
        let rows = PZList.value.map((el) => {
          return { PK_CAR: el.BILLNO };
        });
        tableRef.value.xTable.setCheckboxRow(rows, true);
      }
    });
  });
};
getData();

// 查询条件中的下拉触发查询
const formSelect = (res) => {
  if (res.query) queryEvent();
};
const queryEvent = () => {
  pageInfo.currentPage = 1;
  getData();
};
function handlePageChange({ currentPage, pageSize }) {
  pageInfo.currentPage = currentPage;
  pageInfo.pageSize = pageSize;
  getData();
}

/** 配载相关 */
const PZRef = ref(null);
const PZTableRef = ref(null);
const PZList = ref([]);
const PZFormRules = getFormRule(PZConfig);
const PZTableRules = reactive({
  ENTRUSTNUM: [
    { required: true, min: 0.1, type: "number", message: "委托量不可为空" },
  ],
});
const calcPZListNum = computed(() =>
  PZList.value.reduce((pre, cur) => (pre += cur.ROUND * 1), 0)
);

// 查找树结构中的数据
function treeFind(tree, func, found = { value: false }) {
  for (const data of tree) {
    if (func(data)) {
      found.value = true;
      return data;
    }
    if (data.DRIVERLIST || data.children) {
      const res = treeFind(data.DRIVERLIST || data.children, func, found);
      if (res) return res;
      if (found.value) found.value = false;
    }
  }
  return null;
}
const hasSelectCar = computed(() => PZList.value.map((el) => el.PK_CAR));
const hasSelectDriver = computed(() => PZList.value.map((el) => el.PK_DRIVER));
const AddPZ = ({ checked, isFull, row, selectRow }) => {
  if (checked) {
    let goods = [...goodsList.value.map((al) => {
      return {
        PK_MATERIAL: al.PK_MATERIAL,
        MATERIALNAME: al.MATERIALNAME,
        MATSPEC: al.MATSPEC,
        ENTRUSTNUM: 0,
        NSUMUNIT: al.NSUMUNIT,
        BILLNO: al.DTLBILLNO,
      };
    })];
    if (!goods.length) return proxy.$modal.notifyWarning("物料拉运剩余量不足！");
    if (isFull) {
      PZList.value = selectRow.map((el) => {
        return {
          PK_DRIVER: "",
          DRIVERNAME: el.MANAGER,
          DRIVERPHONE: el.TELEPHONE,
          PK_CAR: el.BILLNO,
          CARNO: el.VNAME,
          LOADWEIGHT: el.LOADWEIGHT,
          ROUND: 1,
          STARTDATE: "",
          ETADATE: "",
          LOADINGMETHOD: orderData.value.LOADINGMETHOD,
          CONTAINERNUM: 1,
          TOTALENTRUSTNUM: "",
          MATINFOS: goods,
        };
      });
    } else {
      let form = {
        PK_DRIVER: "",
        DRIVERNAME: row.MANAGER,
        DRIVERPHONE: row.TELEPHONE,
        PK_CAR: row.BILLNO,
        CARNO: row.VNAME,
        LOADWEIGHT: row.LOADWEIGHT,
        ROUND: 1,
        STARTDATE: "",
        ETADATE: "",
        LOADINGMETHOD: orderData.value.LOADINGMETHOD,
        CONTAINERNUM: 1,
        TOTALENTRUSTNUM: "",
        MATINFOS: goods,
      };
      PZList.value.push(form);
    }
    console.log(111, PZList.value);
  } else {
    if (isFull) {
      PZList.value = [];
    } else {
      let index = PZList.value.findIndex((el) => el.PK_CAR == row.BILLNO);
      PZList.value.splice(index, 1);
    }
  }
};
const PZDel = (index) => {
  let delRow = PZList.value[index];
  proxy.$modal.confirm("是否删除当前配载数据？").then(() => {
    let row = dataList.value.find((el) => el.BILLNO == delRow.PK_CAR);
    if (row) tableRef.value.xTable.setCheckboxRow(row, false);
    PZList.value.splice(index, 1);
  });
};
const PZDelRow = (index, rowIndex) => {
  proxy.$modal.confirm("是否删除当前货物？").then(() => {
    PZList.value[index].MATINFOS.splice(rowIndex, 1);
  });
};

function sum(arr) {
  return arr.reduce((prev, cur) => prev + cur);
}

const validatePZList = () => {
  return new Promise((resolve) => {
    let PZRefArr = [];
    for (let i = 0; i < PZRef.value.length; i++) {
      const form = PZRef.value[i];
      PZRefArr.push(form.submitForm());
      if (orderData.value.LOADINGMETHOD != '1') {
        const table = PZTableRef.value[i];
        PZRefArr.push(table.xTable.validate(true));
      }
    }
    Promise.all(PZRefArr).then((res) => {
      let valids = res.filter((el) => el == undefined || el == true);
      let PZok = true;
      for (let i = 0; i < PZList.value.length; i++) {
        const { LOADWEIGHT, MATINFOS, CARNO, TOTALENTRUSTNUM } = PZList.value[i];
        let GOODSLOAD = orderData.value.LOADINGMETHOD == '1' ? TOTALENTRUSTNUM : sum(MATINFOS.map((el) => Number(el.ENTRUSTNUM)));
        if (GOODSLOAD > LOADWEIGHT) {
          PZok = false;
          return proxy.$modal.notifyWarning(`${CARNO} 委托量超出核载`);
        }
      }
      resolve(PZok && valids.length == PZRefArr.length);
    });
  });
};

const savaLoading = ref(false);
const submitPZ = () => {
  validatePZList().then((valid) => {
    if (!valid) return;
    savaLoading.value = true;
    savePZ({
      BILLNO: BILLNO.value,
      MODE: "4",
      CARINFOS: [...PZList.value],
    }).then((res) => {
      proxy.$modal.msgSuccess("提交成功");
      savaLoading.value = false;
      emits("close");
    }).catch((err) => {
      savaLoading.value = false;
    });
  });
};

/** 获取拉运记录 */
const orderHistory = ref([]);
const modeltitle = ref("");
const modelShow = ref(false);
const modelPageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});
const total = ref(0);
const modelIndex = ref();
const handleHistory = (index) => {
  // if (index) modelIndex.value = index
  modelIndex.value = index;
  let row = dataList.value[modelIndex.value];
  modeltitle.value = row.VNAME;
  getOrderHistory({
    PAGENUM: modelPageInfo.currentPage,
    PAGESIZE: modelPageInfo.pageSize,
    MODULEID: "MU230811295013",
    PAGEID: "PG230811314415",
    DR: "0",
    BILLNO: row.BILLNO,
  }).then((res) => {
    orderHistory.value = res.RESULT.RECORDS;
    total.value = res.RESULT.TOTAL;
    modelShow.value = true;
  });
};
function modelPage({ currentPage, pageSize }) {
  modelPageInfo.currentPage = currentPage;
  modelPageInfo.pageSize = pageSize;
  handleHistory(modelIndex.value);
}
const modalClose = () => {
  modelShow.value = false;
};
</script>
<style lang="scss" scoped>
.app-wrap {
  background: #e7e9f1;
}
.page-outbtn {
  position: absolute;
  top: 4px;
  right: 10px;
  z-index: 5;
  display: flex;
  align-items: center;
}
.group {
  display: block;
  height: 100%;
  background: #fff;
  padding: 10px 20px;
  margin-bottom: 10px;
  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--el-border-color);
    margin-bottom: 10px;
    .title {
      font-weight: bold;
      font-size: 16px;
    }
    .pzinfo {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #8b8b8b;
      .desc {
        margin-left: 5px;
        font-size: 15px;
        color: var(--el-color-primary);
      }
      p {
        margin: 0;
        padding: 0;
      }
    }
  }
  &-content {
    height: calc(100% - 33px);
  }
}
.content {
  margin-bottom: 10px;
  &-item {
    margin: 5px 0;
    display: flex;
    align-items: center;
    font-size: 16px;
    .label {
      color: #1a1a1a;
      white-space: nowrap;
      font-weight: 500;
      &::after {
        content: "：";
      }
    }
    .value {
      color: #000;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
.goodsList {
  list-style: none;
  margin: 0 0 10px;
  padding: 0;
  display: flex;
  align-items: stretch;
  &-item {
    width: calc((100% - 20px) / 3);
    margin-right: 10px;
    padding: 15px;
    background: #f3f7ff;
    border-radius: 10px;
    &:last-child {
      margin-right: 0;
    }
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        display: flex;
        align-items: center;
        .materiel {
          font-size: 16px;
          color: #1a1a1a;
          font-weight: bold;
          margin-right: 10px;
        }
        .desc {
          font-size: 14px;
          color: #444;
        }
      }
    }
    .line {
      margin: 5px 0;
    }
    .surplus {
      color: #0b0b0b;
      font-size: 14px;
    }
  }
}
.group-form {
  display: flex;
  align-items: stretch;
  &-item {
    flex: 1;
    width: calc((100% - 10px) / 2);
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}
.query {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin: 5px 0;
  &-quick {
    color: #606266;
  }
}
.nodata {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 14px;
  overflow: hidden;
}
.list {
  list-style: none;
  margin: 0;
  padding: 10px;
  &-item {
    border: 1px solid var(--el-border-color);
    border-radius: 3px;
    margin-bottom: 10px;
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background: #e8effe;
      overflow: hidden;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      .title {
        width: calc(100% - 25px);
        font-size: 16px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .hzINfo {
          font-size: 14px;
          color: #707070;
          font-weight: normal;
          span {
            color: var(--el-color-primary);
            font-weight: bold;
          }
        }
      }
      .del-icon {
        cursor: pointer;
      }
    }
    .content {
      padding: 10px;
      margin: 0;
    }
  }
}
.redColor {
  color: #e23a3a;
}
</style>