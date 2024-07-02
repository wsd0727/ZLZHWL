<template>
  <template v-if="open">
    <teleport to="#custemPageBtn" :disabled="!(active > 0)">
      <el-button v-if="active > 0" @click="Prev" size="default">上一步</el-button>
    </teleport>
    <teleport to="#custemPageBtn" :disabled="!(active == 0 || pageList.length - 1 > active)">
      <el-button v-if="active == 0 || pageList.length - 1 > active" @click="Next" :disabled="SelectData.length == 0" type="primary" size="default">下一步</el-button>
    </teleport>
    <teleport to="#custemPageBtn" :disabled="!(pageList.length > 0 && active == pageList.length - 1)">
      <el-button v-if="pageList.length > 0 && active == pageList.length - 1" @click="Submit" type="primary" size="default">提交</el-button>
    </teleport>
  </template>
  <div class="StepForm">
    <div class="step">
      <div class="step-item" v-for="(item, index) in pageList" :key="item.BILLNO" :title="item.VNAME">
        <keep-alive>
          <template v-if="active == index">
            <component ref="ComRef" :is="item.GROUPNO == 'FM'?MasterForm:ModalTable" :MODULE="item.PK_MODULE" :PAGE="item.BILLNO" hasConfig :Config="item" :formConfig="item.COLUMNS" v-model:formData="FormData" :formRules="FormRules" :tableConfig="SubTableConfig" :tableRules="SubTableRules" :infoConfig="InfoConfig" :showHistory="false" @change="handleChange"></component>
          </template>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script setup>
import ModalTable from "@/components/Form/modal"
import MasterForm from "@/components/MasterForm";
import { getPageConfig, axiosSave } from "@/api/system/page";
import { getFormValue, deepClone, getFormRule, evilFn } from "@/utils/index"

const props = defineProps({
  config: Object,
  currentData: Object,
})
const emit = defineEmits(["close"])
const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const MODULEID = computed(() => routerParams.BILLNO)
const Config_PAGE = computed(() => props.config.OTHER)
const ComRef = ref(null)

const open = ref(false)
const active = ref(0)
const pageList = ref([])

/** 并发请求 */
function getConfig(urls, max) {
  return new Promise(resolve => {
    if (urls.length === 0) {
      resolve([])
      return
    }
    let index = 0
    let count = 0
    const ResArr = []
    async function request() {
      if (index === urls.length) return
      const i = index
      let { MENU, PAGE } = urls[index]
      index++
      try {
        const Res = await getPageConfig({ MODULEID: MENU, PAGEID: PAGE })
        ResArr[i] = Res
      } catch (err) {
        ResArr[i] = err
      } finally {
        count++
        if (count === urls.length) {
          resolve(ResArr)
        }
        request()
      }
    }
    request()
  })
}

const FormDataBase = ref({})
const FormData = ref({})
const FormRules = ref({})
const SubTableConfig = ref([])
const SubTableRules = ref({})
const InfoConfig = ref([])

const StepBtn = ref([])

const InitConfig = () => {
  let { GROUPNO, COLUMNS, SUBTABLE, FLOATCOM, BUTTON, SLOTCFG, VDEF2 } = pageList.value[active.value]
  StepBtn.value = BUTTON.filter(el => el.ACTION == 'STEP') // 查找接口，如存在则进行单项数据提交
  if (GROUPNO == 'TAB') return
  let formBase = getFormValue(COLUMNS)
  let rules = getFormRule(COLUMNS)
  FormDataBase.value = deepClone(formBase)
  FormData.value = deepClone(formBase)
  FormData.value = Object.assign(FormData.value, margeFormData.value)
  FormRules.value = rules
  SubTableConfig.value = SUBTABLE.map((el) => {
    el._rowConfig = COLUMNS.find((al) => al.FIELD == el.FIELD);
    return el;
  });
  if (SUBTABLE.length > 0 && !props.config.CHOOSE2SUB) setSubTableData();
  InfoConfig.value = !FLOATCOM ? [] : FLOATCOM.map((el) => { el._rowConfig = COLUMNS.find((al) => al.FIELD == el.FIELD); return el; });
}
const setSubTableData = () => {
  let rules = [];
  for (let i = 0; i < SubTableConfig.value.length; i++) {
    const el = SubTableConfig.value[i];
    let { COLUMNS, FIELD, GROUPNO } = el;
    let baseData = getFormValue(COLUMNS)
    delete baseData.EnumData;
    FormData.value[FIELD] = GROUPNO === "TAB" ? [] : { ...baseData };
    let rule = getFormRule(COLUMNS);
    rules.push(rule);
  }
  SubTableRules.value = rules;
};

const SelectData = ref([])
const handleChange = res => {
  SelectData.value = res
}
const margeFormData = ref({})
const Prev = () => {
  if (!active.value) return
  active.value = active.value -= 1
  InitConfig()
  nextTick(() => {
    ComRef.value[0].TableRef && ComRef.value[0].TableRef.xEditTable.setCheckboxRow(SelectData.value, true)
  })
}
const Next = () => {
  if (props.config.CHOOSE2SUB) margeFormData.value = { [props.config.CHOOSE2SUB]: SelectData.value }
  if (active.value >= pageList.value.length - 1) return
  if (StepBtn.value.length) {
    let { ACTIONADDRESS, CHOOSE2SUB } = StepBtn.value[0]
    let { url, data } = ParseOtherConfig(ACTIONADDRESS)
    if (CHOOSE2SUB) {
      data[CHOOSE2SUB] = SelectData.value
      margeFormData.value = { [props.config.CHOOSE2SUB]: SelectData.value }
    }
    if (url) {
      axiosSave(url, data).then(res => {
        margeFormData.value = res.RESULT
        active.value = active.value += 1;
        InitConfig()
      })
    } else {
      active.value = active.value += 1;
      InitConfig()
    }
  } else {
    active.value = active.value += 1;
    InitConfig()
  }
}
const Submit = () => {
  ComRef.value[0].submitForm().then(valid => {
    let { ACTIONADDRESS } = StepBtn.value[0]
    let { url, data } = ParseOtherConfig(ACTIONADDRESS)
    data.MODULEID = pageList.value[active.value].PK_MODULE
    data.PAGEID = pageList.value[active.value].BILLNO
    axiosSave(url, {
      ...data,
      ...FormData.value
    }).then(res => {
      emit("close")
    })
  })
}

// 解析 Other 配置
function ParseOtherConfig(config) {
  if (!config) {
    SelectValueTo.value = []
    return { url: "", data: {} };
  }
  try {
    let newConfig = JSON.parse(config)[0]
    if (newConfig.setvalue && JSON.stringify(newConfig.setvalue) != '{}') {
      let arr = []
      for (const key in newConfig.setvalue) {
        arr.push({ k: key, v: newConfig.setvalue[key] })
      }
      // SelectValueTo.value = arr
    }
    return { url: newConfig.url, data: newConfig?.params }
  } catch (error) {
    if (config.indexOf("/") == '0') {
      let paramsArr = config.split("?"),
        url = "",
        setQueryParam = {},
        queryJson = {};
      if (paramsArr.length == 0) {
        url = config;
        // SelectValueTo.value = [];
      } else if (paramsArr.length > 0) {
        url = paramsArr[0];
        if (paramsArr.length > 1) queryJson = GetUrlParams("a?" + paramsArr[1], "obj");
        if (paramsArr.length > 2) {
          setQueryParam = GetUrlParams("a?" + paramsArr[2], "obj");
          for (let ii in setQueryParam) {
            let valueKey = setQueryParam[ii]
            if (valueKey.includes("M$")) {
              valueKey = calcHasMSKey(valueKey)
              queryJson[ii] = props.mainFormData[valueKey] || "";
            } else if (valueKey.includes("S$")) {
              valueKey = calcHasMSKey(valueKey)
              queryJson[ii] = props.formData[valueKey] || "";
            } else if (valueKey.includes("Q$")) {
              valueKey = calcHasMSKey(valueKey)
              queryJson[ii] = ComRef.value[0]?.QueryForm[valueKey] || ""
            } else {
              queryJson[ii] = props.formData[valueKey] || "";
            }
          }
        }
        // SelectValueTo.value = GetUrlParams("a?" + paramsArr[3], "arr");
      }
      return { url, data: queryJson };
    } else {
      console.error("配置解析错误!", error);
    }
  }
}
// 获取url 后面的参数
function GetUrlParams(url, backType) {
  let reg = /([^&?=]+)=([^&?=]+)/g,
    obj = {},
    arr = [];
  url.replace(reg, function () {
    obj[arguments[1]] = arguments[2];
    let objs = {};
    objs.k = arguments[1];
    objs.v = arguments[2];
    arr.push(objs);
  });
  return backType == "obj" ? obj : arr;
}
// 判断是否存在M$,S$
function calcHasMSKey(key) {
  return (key.includes("M$") || key.includes("S$") || key.includes("Q$")) ? key.slice(2, key.length) : key
}

const getPage = () => {
  if (Config_PAGE.value == '' || !Config_PAGE.value) return
  let pageArr = Config_PAGE.value.split("&"),
    urlArr = [];
  pageArr.forEach(el => {
    let MENU, PAGE;
    if (el.includes("@")) {
      let [menu, page] = el.split("@")
      MENU = menu
      PAGE = page
    } else {
      MENU = MODULEID.value
      PAGE = el
    }
    urlArr.push({ MENU, PAGE })
  });
  getConfig(urlArr, 2).then(res => {
    let arr = []
    for (let i = 0; i < res.length; i++) {
      let el = res[i]
      arr.push(el.RESULT)
    }
    pageList.value = arr
    open.value = true
    InitConfig()
  })
}
getPage()
</script>
<style lang="scss" scoped>
</style>