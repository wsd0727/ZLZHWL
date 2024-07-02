<template>
  <div class="gantt-warp">

    <div class="gantt-main flex-row-bet">
      <div class="flex-item bg-white">
        <div class="title">
          <el-select v-model="PKStore" filterable remote :remote-method="getStoreData" @change="(val) => SelectChange(val)" placeholder="请选择仓库" size="defalute" style="width: 240px">
            <el-option v-for="item in storeOptions" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" />
          </el-select>
        </div>

        <el-divider />
        <div class="ware" :style="{ height: `${wareHeight}px` }">
          <el-scrollbar :height="wareHeight-10">
            <div class="ware-main">
              <div class="ware-x flex-box">
                <div class="x-item" v-for="i in gridConfig.XNUM" :key="i">
                  {{ i }}
                </div>
              </div>
              <div class="ware-y flex-box">
                <div class="ware-y-left">
                  <div class="y-item" v-for="i in gridConfig.YNUM" :key="i">
                    {{ i }}
                  </div>
                </div>

                <div class="ware-y-right">
                  <div class="grid-wrap" :style="{
                      gridTemplateColumns: `repeat(${gridConfig.XNUM}, 50px)`,
                      gridTemplateRows: `repeat(${gridConfig.YNUM}, 50px)`,
                    }">
                    <div class="grid-item" :class="bgColor[i.STATUS]" v-for="i in gridConfig.ROWS" :key="i" @click="handelCell(i)">
                      {{ i.NUM }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <div class="flex-item bg-white">
        <div class="title">库位信息</div>
        <el-divider />

        <div class="location">
          <Form class="" ref="formRef" v-model:formData="detailJson" :formConfig="detailConfig" :inline="false" @select="formSelect" />
          <div class="mb10">
            <span class="ml-3 w-35 text-gray-600 inline-flex items-center">品名：</span>
            <el-input v-model="input2" class="w-50 m-2" placeholder="请输入品名" style="width: 60%" :prefix-icon="Search" />
          </div>

          <Vtable ref="VTableRef" :tableCFG="tableCFG" :tableData="tableData" @change="tableChange">
          </Vtable>

          <div class="flex-box color-desc-wrap">
            <div class="flex-box mr10" v-for="i in colorDesc" :key="i.name">
              <div :class="['color-box', bgColor[i.c]]"></div>
              <div>{{ i.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="gantt2">
import { ElMessage, ElMessageBox } from "element-plus";
import Vtable from "@/components/Tables";
import { getFormRule, getFormValue, deepClone, getUrlParams } from "@/utils";
import { detailForm, tableConfig, queryForm } from "@/config/location";
import { getLocationData, getLocationDetail } from "@/api/mes/location";
import { getPageConfig, getTableData, axiosSave } from "@/api/system/page";

const router = useRouter();
const routerParams = router.currentRoute.value.meta;

const queryJson = ref({});
const queryConfig = queryForm;
const detailConfig = detailForm;
const detailJson = ref({});

const PKStore = ref(null);
const storeOptions = ref([]);

const wareHeight = window.innerHeight - 200;

queryJson.value = getFormValue(queryForm);

const tableCFG = reactive({
  tableColumns: tableConfig,
  hasTableTools: false, // 是否有操作栏
  hasSeq: false, // 是否显示序号
  toolsConfig: [],
  expandID: "",
  loading: false,
  hasFill: false, // 表格补位
  hasEmpty: false,
  height: 300,
  rowClassEval: "", // 行加背景色的条件
  mergeCFG: null, // 表尾合计的配置  字段
  mergeRowField: [], // 需要合并的字段
  SelectType: null,
});

const tableData = ref([]);

const bgColor = {
  0: "bg-gray",
  1: "bg-blue2",
  2: "bg-orange",
  3: "bg-green",
  4: "bg-red",
};

const gridConfig = ref({
  XNUM: 5,
  YNUM: 3,
  ROWS: [
    {
      STATUS: 0,
      NUM: 1,
      ID: "123",
    },
    {
      STATUS: 1,
      NUM: 2,
    },
    {
      STATUS: 2,
      NUM: 3,
    },
    {
      STATUS: null,
      NUM: null,
    },
    {
      STATUS: "",
      NUM: null,
    },
    {
      STATUS: 0,
      NUM: 8,
    },
    {
      STATUS: 1,
      NUM: 9,
    },
    {
      STATUS: 1,
      NUM: 6,
    },
    {
      STATUS: 1,
      NUM: 5,
    },
    {
      STATUS: 0,
      NUM: 5,
    },
    {
      STATUS: 0,
      NUM: 5,
    },
    {
      STATUS: 4,
      NUM: 5,
    },
  ],
});

const colorDesc = ref([
  { c: 0, name: "空货位" },
  { c: 1, name: "有堆放" },
  { c: 2, name: "有预约" },
  { c: 4, name: "封锁中" },
]);

const queryCFG = ref(null);
const buttonCFG = ref(null);
getPageCFG();
// 获取页面动态配置
function getPageCFG() {
  let pageID = {
    APPID: "",
    DATA: {},
    KEY: "",
    MODULEID: routerParams.BILLNO,
    PAGEID: routerParams.ACTION || "123",
    VERSION: "",
  };
  getPageConfig(pageID).then((res) => {
    const { QUERY, COLUMNS, SUBTABLE, FLOATCOM, BUTTON, SLOTCFG, VDEF2 } =
      res.RESULT;
    queryCFG.value = QUERY;
    buttonCFG.value = BUTTON;
    getStoreData("", 1);
  });
}

function getStoreData(k, t) {
  let queryUrl = queryCFG.value[0].OTHER;
  let urlParams = getUrlParams(queryUrl);
  console.log(k, urlParams);
  let data = {
    ...urlParams,
    keyword: k,
    MODULEID: routerParams.BILLNO,
    PAGEID: "",
  };
  getTableData(queryUrl, data)
    .then((res) => {
      storeOptions.value = res.RESULT;
      if (t == 1) {
        PKStore.value = res.RESULT[0].VALUE;
        getStackData("");
      }
    })
    .catch((errr) => {});
}

const SelectChange = (val) => {
  getStackData("");
};

// 获取垛位数据
const getStackData = (k, pk) => {
  let queryUrl = buttonCFG.value[0].ACTIONADDRESS;
  let urlParams = getUrlParams(queryUrl);
  let data = {
    ...urlParams,
    keyword: k,
    PK_STOCK: PKStore.value ,
    MODULEID: routerParams.BILLNO,
    PAGEID: "",
  };
  getTableData(queryUrl, data)
    .then((res) => {
      storeOptions.value = res.RESULT;
    })
    .catch((errr) => {});
};

// 查询条件中的下拉触发查询
const formSelect = (res) => {
  queryEvent();
};

function queryEvent() {
  getLocationData(queryJson.value).then((res) => {
    gridConfig.value = res.RESULT;
  });
}

function handelCell(item) {
  let query = { RACK_NO: item.ID, MAT_NAME: "" };
  if (!item.STATUS) return;
  if (!item.NUM) {
    return ElMessage({
      message: "没有货位信息",
      type: "error",
    });
  }
  getLocationDetail(query).then((res) => {
    detailJson.value = res.RESULT;
    tableData.value = res.RESULT.LISTS;
  });
}
</script>

<style lang="scss" scoped>
.gantt-warp {
  width: 100%;

  .gantt-main {
    .flex-item {
      padding: 6px;
      border-radius: 4px;
    }
    .flex-item:first-child {
      width: 65%;
      margin-right: 10px;
    }
    .flex-item:last-child {
      flex: 1;
    }
  }
}
.grid-wrap {
  display: grid;
  grid-template-columns: repeat(5, 50px);
  grid-template-rows: repeat(5, 50px);
  grid-gap: 10px;
  .grid-item {
    text-align: center;
    line-height: 50px;
    cursor: pointer;
    font-size: 8px;
  }
}

.ware {
  width: 100%;
}

.ware-main {
  text-align: center;

  .ware-x {
    margin-left: 40px;
  }

  .x-item {
    width: 50px;
    min-width: 50px;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
  }

  .y-item {
    height: 50px;
    width: 40px;
    line-height: 50px;
    margin-bottom: 10px;
  }
}

.el-form-item {
  margin-bottom: 0 !important;
}

.color-desc-wrap {
  line-height: 40px;
  margin-top: 20px;
  justify-content: space-around;
  .color-box {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
}
</style>
