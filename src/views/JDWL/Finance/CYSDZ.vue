<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" @click="AllSend">全部推送</el-button>
  </teleport>
  <div class="app-wrap">
    <el-scrollbar :height="scrollHeight">
      <div class="list-item" v-for="(item,index) in DataList" :key="item.BILLNO">
        <div class="title" @click="setSelect(index)">
          <div class="title-item">
            <el-checkbox v-model="item._select" label="" size="large" />
          </div>
          <div class="title-item">承运商：{{ item.OWNERNAME }} </div>
          <div class="title-item">时间：{{ item.COLLECT_DATE }} </div>
        </div>
        <miniTable ref="tableRef" :data="item.LIST" show-footer :footer-method="footerMethod" @change="tableChange">
          <vxe-column title=" " type="seq" width="60" fixed="left" align="center"></vxe-column>
          <vxe-column field="OUT_DATE" title="出库日期" width="100" align="left" show-overflow="tooltip" />
          <vxe-column field="OUT_NO" title="出库单号" width="150" align="left" show-overflow="tooltip" />
          <vxe-column field="CARNO_LOAD" title="车号" width="90" align="left" show-overflow="tooltip" />
          <vxe-column field="DESTINATION" title="到达地" width="100" align="left" show-overflow="tooltip" />
          <vxe-column field="WEIGHT" title="出库重量" width="120" align="right" show-overflow="tooltip" />
          <vxe-column field="PAYABLE" title="应付承运费" width="120" align="right" show-overflow="tooltip" />
          <vxe-column field="TWO_PLACE_SUBSIDY" title="两家卸货补贴" width="120" align="right" show-overflow="tooltip" />
          <vxe-column field="TRIP_SUBSIDY" title="趟数补贴" width="90" align="right" show-overflow="tooltip" />
          <vxe-column field="DIFF_ADJUST" title="差异调整" width="90" align="right" show-overflow="tooltip" />
          <vxe-column field="KX_SUBSIDY" title="跨线补贴" width="90" align="right" show-overflow="tooltip" />
          <vxe-column field="YC_SUBSIDY" title="压车补贴" width="90" align="right" show-overflow="tooltip" />
          <vxe-column field="PAYABLE_TOTAL" title="应收运费合计" width="150" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{ toThousands(row.PAYABLE_TOTAL) }}
            </template>
          </vxe-column>
          <vxe-column field="CREATEDATE" title="备注" width="220" align="center" show-overflow="tooltip" />
        </miniTable>
      </div>
    </el-scrollbar>
    <vxe-pager size="mini" class-name="vxe-page-wrap" :page-size="pageInfo.pageSize" :page-sizes="[5, 10, 20, 30, 50]" :current-page="pageInfo.currentPage" :total="TOTAL" :layouts="['Total','PrevPage','JumpNumber','NextPage','Sizes',]" @page-change="handleSubPageChange" />
  </div>
</template>

<script setup>
import miniTable from "@/components/Tables/mini"
import { toThousands } from "@/utils";
import request from "@/utils/request";

const emits = defineEmits("close")

const scrollHeight = ref(window.innerHeight - 190)

const props = defineProps({
  currentData: String,
  config: Object,
})
const { proxy } = getCurrentInstance();

const pageInfo = reactive({
  currentPage: 1,
  pageSize: 10,
  totalResult: 0,
  sortName: "",
  sortOrder: "",
});

const DataList = ref([])
const TOTAL = ref(0)
const getData = () => {
  let url = "/bms/meetAccountCar/collectPreview/1"
  request({
    url,
    method: "post",
    data: props.currentData.map(el => el.BILLNO)
  }).then(res => {
    DataList.value = res.RESULT
  })
}
const getHistory = () => {
  let url = "/bms/meetAccountCar/collectHistory/1"
  request({
    url,
    method: "post",
    data: {
      "PAGENUM": pageInfo.currentPage,
      "PAGESIZE": pageInfo.pageSize
    }
  }).then(res => {
    DataList.value = res.RESULT.RECORDS.map(el => {
      el._select = false
      return el
    })
    TOTAL.value = res.RESULT.TOTAL
  })
}

const sumNum = (list, field) => {
  let count = 0
  list.forEach(item => {
    count += Number(item[field])
  })
  if (['PAYABLE', 'TWO_PLACE_SUBSIDY', 'TRIP_SUBSIDY', 'DIFF_ADJUST', 'KX_SUBSIDY', 'YC_SUBSIDY', 'PAYABLE_TOTAL'].includes(field)) return toThousands(Number(count.toFixed(2)))
  return Number(count.toFixed(3))
}

const footerMethod = ({ columns, data }) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return '合计'
      }
      if (['WEIGHT', 'PAYABLE', 'TWO_PLACE_SUBSIDY', 'TRIP_SUBSIDY', 'DIFF_ADJUST', 'KX_SUBSIDY', 'YC_SUBSIDY', 'PAYABLE_TOTAL'].includes(column.field)) {
        return sumNum(data, column.field)
      }
      return null
    })
  ]
}

const AllSend = () => {
  let arr = DataList.value.filter(el => el._select).map(el => el.LIST.map(al => al.BILLNO))
  let newArr = []
  arr.map(el => {
    newArr = [...newArr, ...el]
  })
  if (newArr.length == 0) return proxy.$modal.msgError("请勾选推送的数据");
  request({
    url: "/bms/meetAccountCar/push",
    method: "post",
    data: newArr
  }).then(res => {
    proxy.$modal.msgSuccess("推送成功");
    emits("close")
  })
}

const tableChange = data => {
  selectRow.value = data.row
}

const init = () => {
  if (props.currentData.length > 0) {
    getData()
  } else {
    getHistory()
  }
}
init()

</script>
<style lang="scss" scoped>
.app-wrap {
  background: #fff;
}
.title {
  margin: 10px;
  display: flex;
  align-items: center;
  &-item {
    margin-right: 10px;
  }
}
.list {
  &-item {
    margin-right: 10px;
    padding: 10px;
    border-bottom: 1px solid var(--el-border-color);
    &:last-child {
      margin-bottom: 0;
    }
    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>