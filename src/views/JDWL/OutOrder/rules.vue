<template>
  <div class="app-wrap">
    <el-scrollbar :height="windowHeight">
      <div class="group">
        <div class="group-title">
          <div class="title">报号时间规则</div>
          <div class="btn-box">
            <el-button size="default" @click="addRulesItem">新增频次</el-button>
            <el-button type="primary" size="default" @click="saveRules">保存</el-button>
          </div>
        </div>
        <div class="group-content">
          <ul class="rules">
            <li class="rules-item" v-for="(item,index) in signOrderRules" :key="index">
              <div class="titlebox">
                <div class="title">
                  报号频次<span class="icon">{{index+1}}</span>
                </div>
                <el-icon @click="removeSignOrderRules(index)">
                  <CloseBold />
                </el-icon>
              </div>
              <div class="form">
                <el-form ref="signOrderFormRef" :model="signOrderRules[index]" :rules="rules" label-width="100px" size="default">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="选择日期" prop="STARTDATE">
                        <el-date-picker v-model="item.DATEARR" value-format="YYYY-MM-DD" type="daterange" placeholder="请选择" @change="val=>setTime(val,index)" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="选择频次" prop="FRETIMENUM">
                        <el-input-number v-model="item.FRETIMENUM" :min="1" :max="10" @change="val=>setSUBLIT(val,index)" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="截止时间">
                        <div class="time-item" v-for="(ti,jindex) in item.SUBLIST" :key="jindex">
                          <el-form-item label-width="0" :prop="`SUBLIST[${jindex}].ENDTIME`" :rules="rules.SUBLIST.ENDTIME">
                            <el-time-picker v-model="ti.ENDTIME" arrow-control value-format="HH:mm:ss" placeholder="请选择" style="width:120px" />
                          </el-form-item>
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="group">
        <div class="group-title">
          <div class="title">选单时间规则</div>
          <el-button type="primary" size="default" @click="saveTime">保存</el-button>
        </div>
        <div class="group-content">
          <el-form ref="selectTimeRef" :model="selectOrderRules" :rules="rules" label-width="100px" size="default">
            <el-row>
              <el-form-item v-for="(item, index) in selectOrderRules" :key="index" :label="item.VNAME" prop="FRISTTIME">
                <el-col :span="6">
                  <el-input-number v-model="item.VVALUE" :min="1" :max="60" />
                </el-col>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="group">
        <div class="group-title">
          <div class="title">车辆排序规则</div>
          <el-button type="primary" size="default" @click="saveSort">保存</el-button>
        </div>
        <div class="group-content">
          <draggable :list="carSortRulesDict" ghost-class="ghost" :force-fallback="true" chosen-class="chosenClass" animation="300">
            <template #item="{ element, index }">
              <div class="col-tab-box">
                <el-tag effect="plain" class="col-tab" size="large">
                  {{ element.LABEL }}
                </el-tag>
                <el-icon v-if="index != carSortRulesDict.length - 1" class="icon" color="#ccc">
                  <CaretRight />
                </el-icon>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";
import { getSignOrderTimeRules, saveSignOrderTimeRules, removeSignOrderTimeRules, getSelectTimeRules, saveSelectTimeRules, saveCarSortRules } from "#/JDWL/OutOrder/rules"

const windowHeight = computed(() => (window.innerHeight - 115) + 'px')
const { proxy } = getCurrentInstance();

const signOrderFormRef = ref(null)
const selectOrderRef = ref(null)
const selectTimeRef = ref(null)
/** 选单时间规则  */
const rules = reactive({
  STARTDATE: [{ required: true, message: "请选择日期" }],
  FRETIMENUM: [{ required: true, message: "请选择频次" }],
  SUBLIST: {
    ENDTIME: [{ required: true, message: "请选择时间节点" }]
  }
})
const signOrderRules = ref([
  {
    FRESORT: 1,
    DATEARR: [],
    STARTDATE: "",
    ENDDATE: "",
    FRETIMENUM: 1,
    SUBLIST: [{ ENDTIME: "", FRETIMESORT: 1 }]
  },
])

const getData = () => {
  getSignOrderTimeRules().then(res => {
    if (res.RESULT.length > 0) {
      signOrderRules.value = res.RESULT.map(el => {
        el.FRETIMENUM = el.SUBLIST.length
        el.DATEARR = [el.STARTDATE, el.ENDDATE]
        return el
      })
    } else {
      signOrderRules.value = [
        {
          FRESORT: 1,
          DATEARR: [],
          STARTDATE: "",
          ENDDATE: "",
          FRETIMENUM: 1,
          SUBLIST: [{ ENDTIME: "", FRETIMESORT: 1 }]
        },
      ]
    }
  })
}
getData()
const addRulesItem = () => {
  signOrderRules.value.push({
    FRESORT: signOrderRules.value.length,
    DATEARR: [],
    STARTDATE: "",
    ENDDATE: "",
    FRETIMENUM: 1,
    SUBLIST: [{ ENDTIME: "", FRETIMESORT: 1 }]
  })
}
const setTime = (val, index) => {
  if (val) {
    signOrderRules.value[index].STARTDATE = val[0]
    signOrderRules.value[index].ENDDATE = val[1]
  } else {
    signOrderRules.value[index].STARTDATE = ""
    signOrderRules.value[index].ENDDATE = ""
  }
}
const setSUBLIT = (val, index) => {
  let arr = []
  for (let i = 0; i < val; i++) {
    const el = i
    arr.push({ ENDTIME: "", FRETIMESORT: el + 1 })
  }
  signOrderRules.value[index].SUBLIST = arr
}
const saveRules = () => {
  let arr = []
  signOrderFormRef.value.forEach(el => {
    arr.push(el.validate(valid => {
      if (!valid) return false
    }))
  })
  Promise.all(arr).then(res => {
    let valids = res.filter((el) => el == undefined || el == true);
    if (valids.length != signOrderRules.value.length) return false
    saveSignOrderTimeRules({
      data: signOrderRules.value
    }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
    })
  })
}

const removeSignOrderRules = index => {
  let { BILLNO } = signOrderRules.value[index]
  proxy.$modal.confirm(`是否删除频次${index + 1}？`).then(() => {
    removeSignOrderTimeRules({
      BILLNO
    }).then(res => {
      proxy.$modal.msgSuccess("删除成功");
      getData()
    })
  });
}

const { orderXd: selectOrderRulesDict, carsort: carSortRulesDict } = proxy.useDict("carsort", "orderXd")
// watch(selectOrderRulesDict, val => {
// }, {
//   immediate: true
// })
/** 选单时间规则  */
const selectOrderRules = ref({
  FRISTTIME: 5,
  NEXTTIME: 2
})
const getTime = () => {
  getSelectTimeRules().then(res => {
    selectOrderRules.value = res.RESULT
  })
}
const saveTime = () => {
  selectTimeRef.value.validate(valid => {
    if (!valid) return
    saveSelectTimeRules({
      data: selectOrderRules.value
    }).then(res => {
      proxy.$modal.msgSuccess("提交成功");
      getTime()
    })
  })
}
getTime()

/** 车辆排序规则 */
const getSort = () => {
  getCarSortRules().then(res => {

  })
}
const saveSort = () => {
  saveCarSortRules({
    data: carSortRulesDict.value
  }).then(res => {
    proxy.$modal.msgSuccess("提交成功");
    getSort()
  })
}

</script>
<style lang="scss" scoped>
.group {
  padding: 15px;
  background: #fff;
  margin-bottom: 10px;
  &-title {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
.rules {
  margin: 0;
  padding: 0;
  list-style: none;
  &-item {
    padding-left: 20px;
    margin: 10px 0;
    border-bottom: 1px dashed var(--el-border-color);
    &:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }
    .titlebox {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title {
      display: flex;
      align-items: center;
      font-size: 14px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .icon {
        display: block;
        width: 20px;
        height: 20px;
        font-size: 14px;
        background: var(--el-color-primary-light-3);
        border-radius: 50%;
        text-align: center;
        line-height: 20px;
        color: #fff;
        margin-left: 5px;
      }
    }
    .time-item {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
.col-tab-box {
  display: inline-flex;
  align-items: center;
  .col-tab {
    cursor: pointer;
  }
  .icon {
    margin: 0 5px;
  }
}
</style>