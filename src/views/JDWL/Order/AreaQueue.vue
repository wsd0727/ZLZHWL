<template>
  <div class="app-wrap">
    <!-- 查询 -->
    <div class="query-wrap">
      <el-row class="row-bg" justify="space-between">
        <el-col :span="20">
          <Form ref="formRefTop" class="query-form" v-model:formData="queryJson" :formConfig="set24col(QueryConfig, 4)" :inline="true" @select="getData" />
        </el-col>
        <el-col :span="4" class="flex-row-end">
          <el-button @click="getData" type="primary" size="default">查找</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="bg-white position-r">
      <!-- 按钮栏 -->
      <div class="tool-wrap">
        <div class="tool-wrap-left">
          <el-button type="primary" size="Default" @click="sendNo">推送App</el-button>
          <el-button type="primary" size="Default" @click="selectOrder">选单开始</el-button>
          <el-button type="primary" size="Default" @click="selectOrderDetail">选单详情</el-button>
          <el-button type="warning" size="Default" @click="noOrderOver">无单结束</el-button>
        </div>
        <div class="tool-wrap-right">
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="">
      <miniTable ref="tableRef" :data="dataList" :height="windowHeight" :hasDragRow="dataList.length" @dragRow="updateRow">
        <vxe-column width="80" title="最终位置" field="LINESORT" align="center" fixed="left" />
        <vxe-column width="110" title="车号" field="CARNO" align="center" fixed="left" />
        <vxe-column width="100" title="车主" field="OWNER" align="left" />
        <vxe-column width="100" title="组长" field="GROUP_LEADER" align="left" />
        <vxe-column width="160" title="报号时间" field="CREATIONTIME" align="center" />
        <vxe-column width="70" title="类型" align="center">
          <template #default="{row}">
            <template v-if="row.VIP == '1'||row.SCORE == '1'||row.NEWCAR == '1'||row.EXCHANGE == '1'">
              <el-tag type="danger" v-if="row.VIP == '1'">VIP</el-tag>
              <el-tag type="danger" v-if="row.SCORE == '1'">积分</el-tag>
              <el-tag type="danger" v-if="row.NEWCAR == '1'">新车开业</el-tag>
              <el-tag type="warning" v-if="row.EXCHANGE == '1'">作废换单</el-tag>
            </template>
            <el-tag v-else>正常排号</el-tag>
          </template>
        </vxe-column>
        <vxe-column width="100" title="片区" field="AREA" align="center" />
        <vxe-column width="110" title="截止时间" field="FRETIME" align="center" />
      </miniTable>
    </div>

    <!-- 选单详情 -->
    <vxe-modal destroy-on-close v-model="pageConfig.modalVisible" :width="pageConfig.modalW" :height="pageConfig.modalH" id="formModal" resize storage transfer show-zoom show-footer>
      <template #title>
        <span> 选单详情 </span>
      </template>
      <template #default>
        <div class="query-wrap">
          <el-row class="row-bg" justify="space-between">
            <el-col :span="20">
              <el-tree-select v-model="selectArea.PK_AREA" check-strictly clearable filterable remote-show-suffix remote :remote-method="getArea" :data="areaList" @change="changeArea" @clear="changeArea" popper-class="popMaxWidth" :render-after-expand="false" :placeholder="' '" :props="{ label: 'LABEL', children: 'CHILDREN' , disabled: 'ISDISABLED', }" value-key="VALUE" highlightCurrent />
            </el-col>
          </el-row>
        </div>
        <miniTable :data="selectList" height="550px">
          <vxe-column width="110" title="序号" field="LINESORT" align="center" fixed="left" />
          <vxe-column width="150" title="车主" field="OWNER" align="center" />
          <vxe-column width="150" title="车号" field="CARNO" align="center" />
          <vxe-column width="100" title="状态" field="SELSTATUS" align="center">
            <template #default="{row}">
              {{ selectDictLabel(SELSTATUS,row.SELSTATUS) }}
            </template>
          </vxe-column>
        </miniTable>
      </template>
      <template #footer>
        <el-button size="default" type="danger" @click="overTime" :disabled="selectList.length == 0">过号</el-button>
        <el-button size="default" @click="close">关闭</el-button>
      </template>
    </vxe-modal>

  </div>
</template>

<script setup>
import miniTable from "@/components/Tables/mini"
import { getFormValue, deepClone, getShowCFG, getFormRule, getUrlParams, evilFn, uuid } from "@/utils/index";
import { QueryConfig, getQueueAPI, upodateQueue, sendPhoneAPI, startOrderAPI, noOrderEndAPI, getInfo, getEndTime, getList, getAreaData, getOverTime } from "@/api/JDWL/Order/AreaQueue";

const windowHeight = computed(() => (window.innerHeight - 246) + 'px')
const { proxy } = getCurrentInstance();
const { SELSTATUS } = proxy.useDict("SELSTATUS")

const tableRef = ref(null)

const queryJson = ref({})
const dataList = ref([])

const InitForm = () => {
  queryJson.value = getFormValue(QueryConfig)
  getData()
}

const getData = () => {
  getQueueAPI(queryJson.value).then(res => {
    dataList.value = res.RESULT
  })
}

function set24col(data, n) {
  let newdata = deepClone(data);
  let data2 = newdata.filter((i) => {
    i.COL = n == 24 ? n : i.COL || 4;
    return i.GROUPID == 1;
  });
  if (n != 24) {
    data2 = data2.slice(0, 6);
    let sumCol = 0,
      data3 = [];
    data2 = data2.forEach((i) => {
      sumCol += i.COL * 1;
      if (sumCol < 25) {
        data3.push(i);
      }
    });
    data2 = data3;
  } else {
    data2 = newdata;
  }
  return data2;
}

const updateRow = data => {
  let { row, newIndex } = data;
  let newData = {
    PK_AREA: queryJson.value.PK_AREA,
    AREA: queryJson.value.AREA,
    LIST: [{ BILLNO: row.BILLNO, LINESORT: newIndex + 1 }],
  };
  upodateQueue(newData).then(res => {
    getData()
  })
}

const sendNo = () => {
  proxy.$modal.confirm("您确定要推送App?").then(res => {
    sendPhoneAPI({
      PK_AREA: queryJson.value.PK_AREA,
      AREA: queryJson.value.AREA,
    }).then(res => {
      getData()
    })
  })
}

const selectOrder = () => {
  proxy.$modal.confirm("您确定要开始选单?").then(res => {
    startOrderAPI({
      PK_AREA: queryJson.value.PK_AREA,
      AREA: queryJson.value.AREA,
    }).then(res => {
      getData()
    })
  })
}

const selectList = ref([])
const selectArea = ref({
  PK_AREA: "", // queryJson.value.PK_AREA,
  AREA: "" // queryJson.value.AREA
})
const areaList = ref([])
const getArea = (word) => {
  getAreaData({
    KEYWORD: word
  }).then(res => {
    areaList.value = res.RESULT
    if (!selectArea.value.PK_AREA) {
      selectArea.value.PK_AREA = queryJson.value.PK_AREA
      selectArea.value.AREA = queryJson.value.AREA
    }
  })
}
const pageConfig = reactive({
  modalVisible: false,
  modalW: "600px",
  modalH: "70%",
});
const selectOrderDetail = () => {
  getList({
    "PK_AREA": selectArea.value.PK_AREA,
    "AREA": selectArea.value.AREA
  }).then(res => {
    selectList.value = res.RESULT
    pageConfig.modalVisible = true
    if (!areaList.value) return
    nextTick(() => {
      getArea()
    })
  })
}
const changeArea = e => {
  selectArea.value.AREA = treeFind(areaList.value, el => el.VALUE == e).LABEL
  selectOrderDetail()
}
// 查找树结构中的数据
function treeFind(tree, func, found = { value: false }) {
  for (const data of tree) {
    if (func(data)) {
      found.value = true;
      return data;
    }
    if (data.CHILDREN || data.children) {
      const res = treeFind(data.CHILDREN || data.children, func, found);
      if (res) return res;
      if (found.value) found.value = false;
    }
  }
  return null;
}


const noOrderOver = () => {
  proxy.$modal.confirm("您确定无单结束选单?").then(res => {
    noOrderEndAPI({
      PK_AREA: queryJson.value.PK_AREA,
      AREA: queryJson.value.AREA,
    }).then(res => {
      proxy.$modal.msgSuccess("操作成功!")
      getData()
    })
  })
}

const overTime = () => {
  proxy.$modal.confirm("您确定要过号?").then(res => {
    getOverTime({
      PK_AREA: queryJson.value.PK_AREA,
      AREA: queryJson.value.AREA,
    }).then(res => {
      proxy.$modal.msgSuccess("操作成功!")
      selectOrderDetail()
    })
  })
}

InitForm()
</script>
<style lang="scss" scoped>
.app-wrap {
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background-color: #fff;
  .bg-white {
    border-radius: 4px;
  }
  .padding-8 {
    padding: 8px;
  }
  .query-wrap {
    margin: 8px 0;
    // margin-bottom: 6px !important;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .tool-wrap {
    padding-bottom: 8px;
  }
  .page-fixe-bottom {
    position: fixed !important;
    z-index: 10;
    bottom: 10px;
    right: 30px !important;
    height: 34px !important;
  }
}
.query-wrap {
  padding: 10px;
}
</style>