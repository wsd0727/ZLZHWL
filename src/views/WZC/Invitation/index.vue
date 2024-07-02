<template>
  <!-- <teleport to="#custemPageBtn">
     <el-button type="primary" size="default"  @click="">重置该线路</el-button>
      <el-button type="primary" size="default"  @click="">保存该线路</el-button>
      <el-button type="primary" size="default"  @click="">否决该单位</el-button>
    </teleport> -->
  <div class="app-main">
    <div class="group-content">
      <miniTable ref="selectTableRef" rowId="BILLNO" :data="dataListkeep" :height="450" show-overflow="tooltip">
        <vxe-column field="ORDERNUM" title="序号" align="center" min-width="50" fixed="left"></vxe-column>
        <vxe-column field="REVIEWFACTORS" title="评审因素" align="center" width="100"></vxe-column>
        <vxe-column field="PBBZSM" title="评标标准说明" align="center" width="350"></vxe-column>
        <vxe-column field="SCORE" title="分值" align="center" min-width="100"></vxe-column>
        <vxe-column field="REALSCORE" title="打分" align="center" min-width="100">
          <template #default="{row,rowIndex}">
            <el-input v-if="rowIndex < dataListkeep.length - 1" v-model="dataList[rowIndex].REALSCORE" clearable size="small" placeholder="请输入" type="number" style="width: 100%" @blur="REALSCOREBlur(rowIndex)"></el-input>
            <span v-else>{{row.REALSCORE}}</span>
          </template>
        </vxe-column>
      </miniTable>
    </div>
    <div class="text-r mt10" v-if="!detail">
      <el-button size="default" @click="resetBtn">重置</el-button>
      <el-button type="primary" size="default" @click="saveBtn" >保存</el-button>
    </div>

  </div>
</template>
  
<script setup>
import miniTable from "@/components/Tables/mini"
// import { getHasRulesOrder, getRules, saveHasRulesOrder } from "@/api/WZC/Order/Desired"
// import request from '@/utils/request'
import { getEvaluationScoreRubricList, saveData } from "#/WZC/Invitation";

const props = defineProps({
  // currentData: Array
  currentData: Object
})
const emits = defineEmits(['close'])

console.log(props.currentData)

// const BILLNO = computed(() => props.currentData[0].BILLNO || "")

// const windowHeight = computed(() => (window.innerHeight - 160) + 'px')
// const selectTableHeight = computed(() => ((window.innerHeight / 2)) + 'px')
// const tableHeight = computed(() => ((window.innerHeight / 2) - 180) + 'px')

const { proxy } = getCurrentInstance();
// const checkboxConfig = reactive({
//   checkMethod: ({ row }) => {
//     return row.BILLNO != BILLNO.value
//   },
// })

// const { audit, poOrderStatus, demandDealStatus, demandChannel, businessType, isTrue, transportType, transportModel, psType } = proxy.useDict("audit", "poOrderStatus", "demandDealStatus", "demandChannel", "businessType", "isTrue", "transportType", "transportModel", "psType")

// const selectTableRef = ref(null)
// const tableRef = ref(null)

// const selectRules = ref("")
// const rulesList = ref([])

// const radio1 = ref(null)


// const dataListIds = computed(() => dataList.value.map(el => el.BILLNO))
// const orderList = ref([])
// const Total = ref(0)
// const pageInfo = reactive({
//   pageSize: 10,
//   currentPage: 1,
// })

const dataList = ref([])
const dataList1 = ref([])
const dataListkeep = ref([])

onMounted(() => {

  queryList()

});

const queryList = () => {
  getEvaluationScoreRubricList({ BILLNO: props.currentData.BILLNO, PKBILLNO: props.currentData.PKBILLNO })
    .then((res) => {
      let newArr = JSON.parse(JSON.stringify(res.RESULT))
      let num = newArr.reduce((sum, e) => sum + Number(e.REALSCORE || 0), 0)
      let SCOREnum = newArr.reduce((sum, e) => sum + Number(e.SCORE || 0), 0)
      newArr.push({
        ORDERNUM: '合计',
        SCORE: SCOREnum,
        REALSCORE: Number(num).toFixed(2),
      })

      dataList.value = JSON.parse(JSON.stringify(res.RESULT))
      dataList1.value = JSON.parse(JSON.stringify(res.RESULT))
      dataListkeep.value = JSON.parse(JSON.stringify(newArr))
      // resetBtn()
      dataList.value.forEach(item => {
        item.REALSCORE = !item.REALSCORE ? 0 : item.REALSCORE
      })
      // proxy.$modal.msgSuccess("保存成功");
    })
    .finally(() => {
    });
}

const resetBtn = () => {
  dataList.value = JSON.parse(JSON.stringify(dataList1.value))
  dataList.value.forEach(item => {
    // item.REALSCORE = !item.REALSCORE? 0 :item.REALSCORE
    item.REALSCORE = 0
  })
  dataListkeep.value[dataListkeep.value.length - 1].REALSCORE = 0

}

const REALSCOREBlur = (rowIndex) => {
  dataList.value[rowIndex].REALSCORE = Number(dataList.value[rowIndex].REALSCORE).toFixed(2)

  // dataList.value
  let num = dataList.value.reduce((sum, e) => sum + Number(e.REALSCORE || 0), 0)
  dataListkeep.value[dataListkeep.value.length - 1].REALSCORE = num.toFixed(2)
}

const saveBtn = () => {
  saveData(
    dataList.value
  ).then(res => {
    console.log("🚀 ~ saveBtn ~ res:", res)
    proxy.$modal.msgSuccess("提交成功");
    emits("close", res.RESULT || null)
  })
}

</script>
<style lang="scss" scoped>
.app-main {
  height: v-bind(windowHeight);
}

.btnBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group {
  height: calc(50% - 5px);
  background: #fff;
}

.selectBox {
  margin-bottom: 10px;
}

.tips {
  font-size: 12px;
  color: red;
}

:deep(.group .form-group-title .title) {
  max-height: 30px;
}
</style>