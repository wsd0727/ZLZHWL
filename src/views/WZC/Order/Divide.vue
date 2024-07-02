<template>
  <teleport to="#custemPageBtn">
    <el-button type="primary" size="default" @click="submit">提交</el-button>
  </teleport>
  <div class="app-main">
    <formGroup ref="formGroupRef" class="group info" title="需求信息" :fold="false">
      <div class="group-content">
        <ul class="content">
          <li class="content-item">
            <div class="label">需求单号</div>
            <TextOverflow class="val" :content="form.BILLNO"></TextOverflow>
          </li>
          <li class="content-item">
            <div class="label">运输方式</div>
            <TextOverflow class="val" :content="selectDictLabel(transportType,form.TRANSTYPE)"></TextOverflow>
          </li>
          <li class="content-item">
            <div class="label">线路</div>
            <TextOverflow class="val" :content="form.LINENAME"></TextOverflow>
          </li>
          <li class="content-item">
            <div class="label">要求发货时间</div>
            <TextOverflow class="val" :content="form.STARTTIME"></TextOverflow>
          </li>
          <li class="content-item">
            <div class="label">要求送达时间</div>
            <TextOverflow class="val" :content="form.ENDTIME"></TextOverflow>
          </li>
          <li class="content-item">
            <div class="label">发货方</div>
            <TextOverflow class="val" :content="form.SENDCOMPANY"></TextOverflow>
          </li>
          <li class="content-item">
            <div class="label">收货方</div>
            <TextOverflow class="val" :content="form.RECVCOMPANY"></TextOverflow>
          </li>
        </ul>
      </div>
    </formGroup>
    <formGroup ref="formGroupRef" class="group" title="路线信息" :fold="false">
      <div class="group-content">
        <el-scrollbar :height="listHeight">
          <div class="linear">
            <div class="linear-item" v-for="(item,index) in dataList" :key="index">
              <el-form ref="formRef" :model="item" :rules="rules(index)" size="default">
                <div v-if="!item.init" class="delBtn" @click="removeItem(index)">
                  <el-icon>
                    <CircleClose />
                  </el-icon>
                </div>
                <div class="info">
                  <div class="start">
                    <el-form-item :prop="!item.initStart?'PK_SENDADDRESS':''">
                      <template v-if="item.initStart">
                        <el-input v-model="item.SENDADDRESS" disabled readonly></el-input>
                      </template>
                      <el-select v-else v-model="item.PK_SENDADDRESS" value-key="VALUE" placeholder="请选择起点" filterable remote :remote-method="searchWl" @change="val=>setAderss(val,index,'SENDADDRESS')" style="width:100%">
                        <el-option v-for="wlItem in wlList" :key="wlItem.VALUE" :value="wlItem.VALUE" :label="wlItem.LABEL" style="max-width:500px"></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- <el-form-item prop="SENDADDRESS">
                    <el-input v-model="item.SENDADDRESS" :disabled="item.initStart" placeholder="请输入详细地址"></el-input>
                  </el-form-item> -->
                    <el-form-item prop="STARTTIME">
                      <el-date-picker v-model="item.STARTTIME" type="date" :disabled="item.initStart" :disabled-date="time=>disabledTime(time,index)" value-format="YYYY-MM-DD" placeholder="请选择预计发货时间" style="width:100%" />
                    </el-form-item>
                  </div>
                  <div class="type">
                    <el-form-item prop="TRANSTYPE">
                      <el-select v-model="item.TRANSTYPE" placeholder="选择运输方式" style="width:150px">
                        <el-option v-for="item in singleTransType" :key="item.BILLNO" :label="item.LABEL" :value="item.VALUE" />
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="end">
                    <el-form-item :prop="!item.initEnd?'PK_RECVADDRESS':''">
                      <template v-if="item.initEnd">
                        <el-input v-model="item.RECVADDRESS" disabled readonly></el-input>
                      </template>
                      <el-select v-else v-model="item.PK_RECVADDRESS" value-key="VALUE" placeholder="请选择终点" filterable remote :remote-method="searchWl" @change="val=>setAderss(val,index,'RECVADDRESS')" style="width:100%">
                        <el-option v-for="wlItem in wlList" :key="wlItem.VALUE" :value="wlItem.VALUE" :label="wlItem.LABEL" style="max-width:500px"></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- <el-form-item prop="RECVADDRESS">
                    <el-input v-model="item.RECVADDRESS" :disabled="item.initEnd" placeholder="请输入详细地址"></el-input>
                  </el-form-item> -->
                    <el-form-item prop="ENDTIME">
                      <el-date-picker v-model="item.ENDTIME" type="date" :disabled="item.initEnd" :disabled-date="time=>disabledTime(time,index)" value-format="YYYY-MM-DD" placeholder="请选择预计到达时间" style="width:100%" />
                    </el-form-item>
                  </div>
                </div>
                <div v-if="index != dataList.length - 1" class="add" @click="addItem(index)">
                  <el-icon>
                    <Plus />
                  </el-icon>新增节点
                </div>
              </el-form>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </formGroup>
  </div>
</template>

<script setup>
import TextOverflow from "@/components/TextOverflow"
import { getDetail, saveDivide, getWl } from "@/api/WZC/Order/Divide"

const windowHeight = computed(() => (window.innerHeight - 160) + 'px')
const listHeight = computed(() => (window.innerHeight - 220) + 'px')

const props = defineProps({
  currentData: String
})
const BILLNO = computed(() => props.currentData[0].BILLNO || "")
const { proxy } = getCurrentInstance();
const emits = defineEmits(['close'])
const { transportType, singleTransType } = proxy.useDict("transportType", "singleTransType")
const rules = computed(index => {
  return index => {
    return {
      TRANSTYPE: [{ required: true, message: "请选择运输方式", trigger: "change" }],
      PK_SENDADDRESS: [{ required: true, message: "请选择起点", trigger: "change" }, {
        validator: (rule, value, callback) => {
          if (dataList.value[index].PK_RECVADDRESS == value) {
            callback("起点和终点不能相同")
          } else {
            callback()
          }
        }
      }],
      PK_RECVADDRESS: [{ required: true, message: "请选择终点", trigger: "change" }, {
        validator: (rule, value, callback) => {
          if (dataList.value[index].PK_SENDADDRESS == value) {
            callback("起点和终点不能相同")
          } else {
            callback()
          }
        }
      }],
      STARTTIME: [{ required: true, message: "请选择预计发货时间", trigger: "change" }],
      ENDTIME: [{ required: true, message: "请选择预计到达时间", trigger: "change" }]
    }
  }
})
const formRef = ref(null)
const form = ref({})
const disabledTime = (time, index) => {
  return time.getTime() < new Date(dataList.value[index].STARTTIME || form.value.STARTTIME).getTime() || time.getTime() > new Date(dataList.value[index].ENDTIME || form.value.ENDTIME).getTime()
}
const getData = () => {
  getDetail({
    BILLNO: BILLNO.value,
    MODULEID: "MU230803113151",
    PAGEID: "PG230817482347"
  }).then(res => {
    form.value = res.RESULT
    initData()
  }).finally(() => {
    searchWl()
  })
}
const dataList = ref([])

const wlList = ref([])
const searchWl = (keyword = "") => {
  getWl({
    KEYWORD: keyword,
    TYPE: "263"
  }).then(res => {
    wlList.value = res.RESULT
  })
}
const setAderss = (val, index, key) => {
  let data = wlList.value.find(el => el.VALUE == val)
  dataList.value[index][key] = data.LABEL
}

const initData = () => {
  dataList.value = [{
    init: true,
    initStart: true,
    initEnd: false,
    TRANSTYPE: "",
    PK_SENDADDRESS: form.value.PK_SENDADDRESS,
    SENDADDRESS: form.value.SENDADDRESS,
    PK_RECVADDRESS: "",
    RECVADDRESS: "",
    STARTTIME: JSON.parse(JSON.stringify(form.value.STARTTIME)),
    ENDTIME: "",
  }, {
    init: true,
    initStart: false,
    initEnd: true,
    TRANSTYPE: "",
    PK_SENDADDRESS: "",
    SENDADDRESS: "",
    PK_RECVADDRESS: form.value.PK_RECVADDRESS,
    RECVADDRESS: form.value.RECVADDRESS,
    STARTTIME: "",
    ENDTIME: JSON.parse(JSON.stringify(form.value.ENDTIME))
  }]
  // 增加初始化 默认 几个节点逻辑 从接口读取
  if (form.value.SPLITNUM > 0) {
    for (let i = 0; i < Number(form.value.SPLITNUM); i++) {
      addItem(i)
    }
  }
}
const addItem = index => {
  dataList.value.splice(index + 1, 0, {
    init: false,
    initStart: false,
    initEnd: false,
    TRANSTYPE: "",
    PK_SENDADDRESS: "",
    SENDADDRESS: "",
    PK_RECVADDRESS: "",
    RECVADDRESS: "",
    STARTTIME: "",
    ENDTIME: ""
  })
}
const removeItem = index => {
  proxy.$modal.confirm(`是否删除路线节点？`).then(() => {
    dataList.value.splice(index, 1)
  });
}
const submit = () => {
  let arr = []
  formRef.value.forEach(el => {
    arr.push(el.validate(valid => {
      if (!valid) return false
    }))
  })
  Promise.all(arr).then(res => {
    let valids = res.filter((el) => el == undefined || el == true);
    if (valids.length != formRef.value.length) return false
    let transType = Array.from(new Set(dataList.value.map(el => el.TRANSTYPE))).length
    if (form.value.TRANSTYPE == '3' && transType < 2) return proxy.$modal.notifyError("运输方式需包含汽运、船运 2种运输方式");
    if (form.value.TRANSTYPE == '7' && transType < 3) return proxy.$modal.notifyError("运输方式需包含汽运、铁运、船运 3种运输方式");
    saveDivide({
      BILLNO: BILLNO.value,
      MODE: "SECTION",
      ROADLIST: dataList.value
    }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      emits("close")
    })
  })
}
getData()
</script>
<style lang="scss" scoped>
.app-main {
  height: v-bind(windowHeight);
  display: flex;
  align-items: stretch;
  background: #fff;
  .group {
    flex: 1;
    &.info {
      flex: 0.45;
      margin-right: 20px;
    }
  }
}
.info {
  .content {
    list-style: none;
    margin: 0;
    padding: 10px;
    font-size: 16px;
    &-item {
      display: flex;
      align-items: center;
      margin: 5px 0;
      .label {
        width: 100px;
        margin-right: 10px;
        text-align: right;
      }
    }
  }
}
.linear {
  padding-right: 20px;
  &-item {
    position: relative;
    .delBtn {
      width: 24px;
      height: 24px;
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 24px;
      background: #fff;
      z-index: 1;
      color: var(--el-color-danger);
    }
    .info {
      display: flex;
      align-items: flex-start;
      border: 1px solid var(--el-border-color);
      border-radius: 8px;
      padding: 20px 20px 10px;
      .start,
      .end {
        width: calc((100% - 30%) / 2);
        padding-left: 30px;
        position: relative;
        &::before {
          position: absolute;
          left: -5px;
          top: 10px;
          font-size: 14px;
          color: #fff;
          padding: 0 3px;
          border-radius: 3px;
        }
      }
      .start::before {
        content: "起";
        background: var(--el-color-primary);
      }
      .end::before {
        content: "终";
        background: var(--el-color-warning);
      }
      .type {
        width: 30%;
        margin: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 2px dotted var(--el-border-color);
      }
      .value {
        margin-bottom: 15px;
      }
    }
    .add {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      font-size: 14px;
      text-align: center;
      color: var(--el-color-primary);
      cursor: pointer;
    }
  }
}
</style>