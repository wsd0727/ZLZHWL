<template>
  <div class="app-table">
    <el-form ref="formRef" :model="form" :rules="rules">
      <table border="1" v-for="(item0, index) in reportData" :key="index" height="600" class="appTab" cellspacing="0">
        <tr v-for="(item1, index0) in item0" :key="index0">
          <td v-for="(item2, index2) in item1" :key="index2" :colspan="item2.COLSPAN" :rowspan="item2.ROWSPAN">
            <template v-if="item2.EDIT != true">
              <span class="textSpan">{{ item2.TITLE }}</span>
            </template>
            <template v-if="item2.EDIT == true">
              <el-form-item :prop="`${item2.NAME}`">
                <el-input-number :disabled="props.reportFromData.isDetail" v-if="item2.TEXTAREA != true" v-model="form[item2.NAME]" controls-position="right" class="NumTabInput" type="number" :max="item2.MAXSCORE" :min="1" />
                <input :disabled="props.reportFromData.isDetail" v-model="form[item2.NAME]" v-if="item2.TEXTAREA == true" class="TabInput" type="text" />
              </el-form-item>
            </template>
          </td>
        </tr>
      </table>
    </el-form>

    <div class="formClass" v-if="
        (props.reportFromData.examine == true &&
          props.reportFromData.type == 2) ||
        (props.reportFromData.examine == false &&
          props.reportFromData.type == 1)
      ">
      <el-form ref="formRef" :model="formModel" label-width="120px" :rules="rules">
        <el-form-item label="审核结果" prop="radio">
          <el-radio-group v-model="formModel.radio" class="ml-4" @change="setRules">
            <el-radio label="5" size="small">同意</el-radio>
            <el-radio label="6" size="small">不同意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="desc">
          <el-input v-model="formModel.desc" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { getReportPost } from "@/api/system/reportForm";
const { proxy } = getCurrentInstance();
const props = defineProps({
  reportFromData: Object,
});
const formRef = ref()
const rules = ref({
  radio: [{ required: true, message: "审核结果不可为空", trigger: "blur" }],
  desc: [{ required: false, message: "审核意见不可为空", trigger: "blur" }]
})
const setRules = val => {
  rules.value.desc[0].required = val == '6'
}
const handData = () => { };
const reportData = ref([]);
const form = ref({});
const formModel = ref({
  radio: "5",
  desc: "",
});


import {
  getUrlParams
} from "@/utils/index";

/** 查询授权用户列表 */
function getList() {
  let data = {
    PKBILLNO: props.reportFromData.billno,
    TYPE: props.reportFromData.type,
    MODULEID: props.reportFromData.moduleid,
    PAGEID: props.reportFromData.pageid,
  };
  let URL =  props.reportFromData.queryURL || 'base/bdcarrevalutemplatedtl/getTemplateInfo'
  if(URL.includes('?')){
    let params = getUrlParams(URL) 
    data = Object.assign(data,params)
  }
  getReportPost(URL,data).then((res) => {
    let data = res.RESULT[0];
    let editForm = {}, editrules = {};
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      let edit = el.filter((al) => al.EDIT == true);
      if (edit.length > 0) {
        editForm = { ...editForm, ...mapToForm(edit).obj };
        editrules[mapToForm(edit).key] = [{ required: true, message: "输入框不可为空", trigger: "blur" }]
      }
    }
    rules.value = { ...rules.value, ...editrules };
    form.value = editForm;
    reportData.value = res.RESULT;
  });
}
function mapToForm(data) {
  let obj = {}, key = ""
  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    key = el.NAME;
    obj[el.NAME] = el.TITLE;
  }
  return {
    key,
    obj
  }
}
function submit() {
  return new Promise(resolve => {
    formRef.value.validate(valid => {
      resolve(valid)
    });
  })
}
getList();
handData();

defineExpose({
  reportForm: form,
  FormModel: formModel,
  submit,
});
</script>

<style lang="scss" scoped>
.app-table {
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  background-color: #fff;
  // padding: 2px;
  .appTab {
    width: 100%;
    font-size: 14px;
    padding: 0px;
    margin: 0;
    tr {
      height: 25px;
      td {
        height: 25px;
      }
      .NumTabInput {
        border: 0px;
        width: 100%;
      }
      .TabInput {
        border: 0px;
        width: 100%;
        height: 50px;
        margin-top: 15px;
      }
    }
  }
}
.textSpan {
  white-space: pre-wrap;
}
.formClass {
  margin-top: 20px;
}
</style>
