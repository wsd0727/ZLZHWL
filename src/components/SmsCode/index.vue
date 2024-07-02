<template>
  <el-input v-model="phone" style="width:100%">
    <template #append>
      <el-button @click="getCode" :disabled="time > 0">{{time < 0 ?'获取验证码' : `${time}s`}}</el-button>
    </template>
  </el-input>
</template>

<script setup>

/**
 * @description: 短信验证码组件
 * @author: WangJun
 * @createTime: 2023/03/27 16:33:34
 */
import request from '@/utils/request'

const props = defineProps({
  modelValue: String,
  config: Object
})
const emits = defineEmits(["update:modelValue"])

const phone = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits("update:modelValue", val)
  }
})

const time = ref(-1)
const outtime = ref(null)

const getCode = () => {
  if (time.value > 0) return
  // 发送验证码
  let { url, data } = ParseOtherConfig(props.config.OTHER);
  if (!url) return console.error("SmsCode 配置错误");
  request({
    url,
    method: 'POST',
    data: {
      ...data,
      PHONE: phone.value
    }
  }).then(res => {
    initTime()
  })
}

const initTime = () => {
  time.value = 60
  outtime.value = setInterval(() => {
    time.value--
    if (time.value <= 0) {
      clearInterval(outtime.value)
    }
  })
}

// 解析 Other 配置
function ParseOtherConfig(config) {
  if (!config) {
    // SelectValueTo.value = []
    return { url: "", data: {}, importantData: {} };
  }
  try {
    let newConfig = JSON.parse(config)[0]
    if (newConfig.setvalue && JSON.stringify(newConfig.setvalue) != '{}') {
      // let arr = []
      // for (const key in newConfig.setvalue) {
      //   arr.push({ k: key, v: newConfig.setvalue[key] })
      // }
      // SelectValueTo.value = arr
    }
    return { url: newConfig.url, data: newConfig?.params, importantData: newConfig?.importantData }
  } catch (error) {
    if (config.indexOf("/") == '0') {
      let paramsArr = config.split("?"),
        url = "",
        setQueryParam = {},
        queryJson = {},
        setImportantParam = {},
        importantData = {};
      if (paramsArr.length == 0) {
        url = config;
        // SelectValueTo.value = [];
      } else if (paramsArr.length > 0) {
        url = paramsArr[0];
        if (paramsArr.length > 1) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[1], "obj");
          queryJson = obj
          importantData = importantObj
        }
        if (paramsArr.length > 2) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[2], "obj");
          setQueryParam = obj
          setImportantParam = importantObj
          queryJson = { ...queryJson, ...ConvertData(setQueryParam) }
          importantData = { ...importantData, ...ConvertData(setImportantParam) }
        }
        // paramsArr[3] ? SelectValueTo.value = GetUrlParams("a?" + paramsArr[3], "arr") : []
      }
      return { url, data: queryJson, importantData };
    } else {
      console.error("SmsCode 配置解析错误!", error);
    }
  }
}


/** 转换数据 */
function ConvertData(obj) {
  let data = {}
  for (let ii in obj) {
    let valueKey = obj[ii]
    if (valueKey.includes("M$")) {
      valueKey = calcHasMSKey(valueKey)
      data[ii] = props.mainFormData[valueKey] || "";
    } else if (valueKey.includes("S$")) {
      valueKey = calcHasMSKey(valueKey)
      data[ii] = props.formData[valueKey] || "";
    } else {
      data[ii] = props.formData[valueKey] || "";
    }
  }
  return data
}


// 获取url 后面的参数
function GetUrlParams(url, backType) {
  let reg = /([^&?=]+)=([^&?=]+)/g,
    obj = {},
    importantObj = {},
    arr = [];
  url.replace(reg, function () {
    if (arguments[1].includes("!")) {
      let key = arguments[1].substr(1); //删除第一个字符
      importantObj[key] = arguments[2];
    } else {
      obj[arguments[1]] = arguments[2];
    }
    let objs = {};
    objs.k = arguments[1];
    objs.v = arguments[2];
    arr.push(objs);
  });
  return backType == "obj" ? { obj, importantObj } : arr;
}

</script>
<style lang="scss" scoped>
</style>