<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" @click="submit">提交</el-button>
  </teleport>
  <div class="app-wrap">
    <div class="group">
      <formGroup ref="formGroupRef" title="结算信息" :fold="false">
        <template #right>
          <el-button type="primary" size="default" @click="addOrder">添加结算单</el-button>
        </template>
        <miniTable ref="miniTableRef" :data="dataList" :height="200">
          <vxe-column field="BILLNO" title="结算单号" width="150" align="left" show-overflow="tooltip" />
          <vxe-column field="COMPANYNAME" title="委托企业" width="200" align="left" show-overflow="tooltip" />
          <vxe-column field="SIDENAME" title="承运商" width="200" align="left" show-overflow="tooltip" />
          <!-- <vxe-column field="MATSPEC" title="物料" align="left" show-overflow="tooltip" /> -->
          <vxe-column field="YJWEIGHT" title="应结量" width="120" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{row.YJWEIGHT}}{{row.UNIT}}
            </template>
          </vxe-column>
          <vxe-column field="SJWEIGHT" title="实结量" width="120" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{row.SJWEIGHT}}{{row.UNIT}}
            </template>
          </vxe-column>
          <vxe-column field="YJAMT" title="应结运费" width="120" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{row.YJAMT}}元
            </template>
          </vxe-column>
          <vxe-column field="DEDUCTIONMONEY" title="扣款" width="120" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{row.DEDUCTIONMONEY}}元
            </template>
          </vxe-column>
          <vxe-column field="EXPENSESATM" title="杂费" width="120" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{row.EXPENSESATM}}元
            </template>
          </vxe-column>
          <vxe-column field="SHAREATM" title="分摊费" width="120" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{row.SHAREATM}}元
            </template>
          </vxe-column>
          <vxe-column field="SJAMT" title="实结运费" width="120" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{row.SJAMT}}元
            </template>
          </vxe-column>
          <vxe-column field="CREATEINVOAMT" title="已开票金额" width="140" align="right" show-overflow="tooltip"><template #default="{row}">
              {{row.CREATEINVOAMT}}元
            </template>
          </vxe-column>
          <vxe-column field="RESIDUEINVOAMT" title="剩余开票金额" width="140" align="right" show-overflow="tooltip">
            <template #default="{row}">
              {{row.RESIDUEINVOAMT}}元
            </template>
          </vxe-column>
          <vxe-column field="INVOICEAMT" title="开票金额" width="120" align="right" fixed="right" show-overflow="tooltip">
            <template #default="{row}">
              <el-input-number :controls="false" v-model="row.INVOICEAMT" clearable type="number" :min="0" :max="row.RESIDUEINVOAMT" @blur="totalInfo" style="width: 100%" />
            </template>
          </vxe-column>
          <vxe-column field="MATSPEC" title="操作" width="80" align="center" fixed="right" show-overflow="tooltip">
            <template #default="{row}">
              <el-link type="danger" @click="delRow(row)">删除</el-link>
            </template>
          </vxe-column>
        </miniTable>
        <Form ref="FormRef" v-model:formData="form" label-width="100px" :formConfig="YSConfig" :rules="Rules"></Form>
      </formGroup>
      <formGroup ref="formGroupRef" title="货主信息" :fold="false">
        <Form ref="FormRef" v-model:formData="form" label-width="100px" :formConfig="HZConfig" :rules="Rules"></Form>
      </formGroup>
      <formGroup ref="formGroupRef" title="承运商信息" :fold="false">
        <Form ref="FormRef" v-model:formData="form" label-width="100px" :formConfig="systemConfig?.systemCode == 'ZLZHWL'?ZLCYSConfig:CYSConfig" :rules="Rules"></Form>
      </formGroup>
    </div>
    <div class="group">
      <formGroup ref="formGroupRef" title="发票登记" :fold="false">
        <Form ref="FormRef" v-model:formData="form" label-width="100px" :formConfig="FPConfig" :rules="Rules"></Form>
      </formGroup>
    </div>

    <!-- 弹窗 -->
    <template>
      <vxe-modal className="FormModel" destroy-on-close v-model="modalConfig.open" :width="modalConfig.width" :height="modalConfig.height" id="FormModel" resize storage transfer show-zoom show-footer @zoom="resizeModal">
        <template #title>
          <span> {{ modalConfig.title }} </span>
        </template>
        <template #default>
          <ModalTable ref="modalRef" :MODULE="modalConfig.MENUID" :PAGE="modalConfig.PAGEID" :params="modalConfig.params" @submit="SelectChange" />
        </template>
        <template #footer>
          <el-button type="primary" size="default" @click="modalSubmit">保存</el-button>
        </template>
      </vxe-modal>
    </template>

  </div>
</template>

<script setup>
import miniTable from "@/components/Tables/mini"
import Form from "@/components/Form";
import formGroup from "@/components/Form/formGroup"
import ModalTable from "@/components/Form/modal"
import { getHZInfo, getCYSInfo, saveInvoice, YSConfig, HZConfig, CYSConfig, FPConfig,ZLCYSConfig } from "@/api/WZC/Finance/Invoice"
import { getFormValue, getFormRule } from "@/utils"
import useSettingsStore from "@/store/modules/settings";

const settingsStore = useSettingsStore();
const systemConfig = computed(() => settingsStore.systemConfig);

const { proxy } = getCurrentInstance();
const emits = defineEmits(['close'])

const FormRef = ref(null)
const miniTableRef = ref(null)
const modalRef = ref(null)

const dataList = ref([])
const form = ref({})
const Rules = ref({})
const Init = () => {
  if(systemConfig.value?.systemCode == 'ZLZHWL'){
    form.value = { ...getFormValue(HZConfig), ...getFormValue(ZLCYSConfig), ...getFormValue(FPConfig) }
    Rules.value = { ...getFormRule(HZConfig), ...getFormRule(ZLCYSConfig), ...getFormRule(FPConfig) }
  }else{
    form.value = { ...getFormValue(HZConfig), ...getFormValue(CYSConfig), ...getFormValue(FPConfig) }
    Rules.value = { ...getFormRule(HZConfig), ...getFormRule(CYSConfig), ...getFormRule(FPConfig) }
  }
}

const modalConfig = reactive({
  open: false,
  width: "85%",
  height: "80%",
  title: "选择结算单",
  MENUID: "MU230922766864",
  PAGEID: "PG230922905129",
  params: {},
})
const addOrder = () => {
  modalConfig.open = true
}
const getInfo = () => {
  // if(dataList.value.length) return false
  getHZInfo(dataList.value[0].PK_COMPANY).then(res => {
    form.value.PK_COMPANY = res.RESULT.BILLNO
    form.value.COMPANYNAME = res.RESULT.VNAME
    form.value.COMPANYIDENTICODE = res.RESULT.TAXNO
    form.value.COMPANYBANK = res.RESULT.OPENINGBANK;
    form.value.COMPANYACCOUNT = res.RESULT.BANKACCOUNT
    form.value.COMPANYPHONE = res.RESULT.OUTERPHONE
    form.value.COMPANYADDR = res.RESULT.ADDRESS
  })
  getCYSInfo(dataList.value[0].PK_SIDE).then(res => {
    form.value.PK_CARRIER = res.RESULT.BILLNO
    form.value.CARRIERNAME = res.RESULT.VNAME
    form.value.CARRIERIDENTICODE = res.RESULT.TAXNO;
    form.value.CARRIERBANK = res.RESULT.OPENINGBANK;
    form.value.CARRIERACCOUNT = res.RESULT.BANKACCOUNT
    form.value.CARRIERPHONE = res.RESULT.CONTACTTEL
    form.value.CARRIERADDR = res.RESULT.ADDRESS
  })
}
const SelectChange = data => {
  let { BILLNO } = data
  let ids = dataList.value.map(el => el.BILLNO)
  modalConfig.open = false
  if (ids.includes(BILLNO)) return false
  if (data.INVOICEAMT < data.RESIDUEINVOAMT) data.INVOICEAMT = data.RESIDUEINVOAMT
  dataList.value.push(data)
}
const modalSubmit = () => {
  let data = modalRef.value.rows
  modalConfig.open = false
  if (!data.length) return false
  let ids = dataList.value.map(el => el.BILLNO)
  let arr = []
  data.forEach(el => {
    let { BILLNO } = el
    if (ids.includes(BILLNO)) return false
    if (el.INVOICEAMT < el.RESIDUEINVOAMT) el.INVOICEAMT = el.RESIDUEINVOAMT
    arr.push(el)
  })
  dataList.value = [...dataList.value, ...arr]
}
const delRow = row => {
  proxy.$modal.confirm("是否删除选中行数据？").then(() => {
    miniTableRef.value.xTable.remove(row);
    let { tableData } = miniTableRef.value.xTable.getTableData()
    dataList.value = tableData
    getInfo()
    totalInfo()
  })
}

watch(() => dataList.value, () => {
  getInfo()
  totalInfo()
}, {
  deep: true
})

/** 计算统计信息 */
const totalInfo = () => {
  let fpNUM = 0,
    ysTOTAL = 0,
    ysNUM = 0;
  for (let i = 0; i < dataList.value.length; i++) {
    const el = dataList.value[i];
    fpNUM += Number(el.INVOICEAMT) || 0
    ysTOTAL += Number(el.SJWEIGHT)
    ysNUM += Number(el.SJAMT)
  }
  form.value.TOTALSUM = Number(fpNUM.toFixed(2))
  // form.value.TRANSUM = Number(ysTOTAL.toFixed(3))  // 240222 无需计算
  form.value.AMOUNTAMT = Number(ysNUM.toFixed(2))
}

const submit = () => {
  FormRef.value.submitForm().then(valid => {
    if (!valid) return false
    if (dataList.value.length == 0) return proxy.$modal.notifyWarning("结算信息不可为空")
    if (form.value.TOTALSUM <= '0') return proxy.$modal.notifyWarning("发票金额不可为 0")
    form.value.SUBLIST = dataList.value
    saveInvoice(form.value).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      emits("close")
    })
  })
}

Init()
</script>
<style lang="scss" scoped>
.group {
  background: #fff;
  margin-bottom: 10px;
  padding: 0 10px;
}
::deep(.val_table) {
  margin-bottom: 20px;
}
</style>