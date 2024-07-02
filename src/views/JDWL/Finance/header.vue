<template>
  <span @click="handleSort(column)">{{ column.title }}</span>
  <el-popover v-if="hasSearch" placement="bottom" :width="config?.WIDTH" trigger="click">
    <template #reference>
      <span class="custom-sort">
        <i class="vxe-icon-funnel"></i>
      </span>
    </template>
    <el-input v-if="config.CONTROLS == 'ExTextBox' " v-model="queryJson[config.FIELD]" @keydown.enter="filterEvent" clearable />
    <template v-else-if="config.CONTROLS == 'ExSelect'">
      <el-select placeholder=" " v-model="queryJson[config.FIELD]" clearable style="width: 100%" @change="filterEvent">
        <el-option v-for="itemST in queryJson.EnumData[config.FIELD]" :key="itemST.VALUE" :label="itemST.LABEL" :value="itemST.VALUE" />
      </el-select>
    </template>
    <div v-else-if="config.CONTROLS == 'ExSelectSearch'">
      <el-select v-model="tableCFG.queryJson[config.FIELD]" clearable filterable remote remote-show-suffix :remote-method="SelectQuery" :loading="SelectLoading" placeholder=" " @focus="SelectFocus" @change="SelectChange" @clear="SelectChange" @keydown.enter="enterNextEl">
        <el-option v-for="itemST in tableCFG.queryJson.EnumData[config.FIELD]" :key="itemST.VALUE" :label="itemST.LABEL" :value="itemST.VALUE" style="max-width:300px" />
      </el-select>
    </div>
    <el-date-picker v-else-if="config.CONTROLS == 'ExDateRange'" @clear="DateChange(null)" @change="DateChange" v-model="queryJson[config.FIELD+'Arr']" unlink-panels clearable :type="mapDateType(true).type" range-separator="至" :value-format="mapDateType(true).format" style="width: 100%" />
    <el-date-picker v-else-if="config.CONTROLS == 'ExDateTime'" v-model="queryJson[config.FIELD]" clearable @clear="DateChange(null)" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" @change="DateChange" />
    <el-date-picker v-else-if="config.CONTROLS == 'ExDateTimeRange'" @change="DateChange" v-model="queryJson[config.FIELD+'Arr']" clearable @clear="DateChange(null)" unlink-panels :prefix-icon="9" type="datetimerange" range-separator="至" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
  </el-popover>
</template>

<script setup>
const props = defineProps({
  column: Object,
  config: Object,
  queryJson: Object
})
const emit = defineEmits(["update:queryJson", "filterEvent", "handleSortEvent"]);
const { proxy } = getCurrentInstance();
const hasSearch = computed(() => {
  if (!props.config) return false
  return props.config && props.queryJson.hasOwnProperty(props.config.FIELD)
}
)

const filterEvent = () => {
  emit("update:queryJson", props.queryJson)
  emit("filterEvent");
};

const handleSort = () => {
  emit("handleSortEvent", props.column);
}

const SelectFocus = (config) => {
  let { FIELD } = config;
  // if (!SelectOptions.value[FIELD] || SelectOptions.value[FIELD].length) return
  SelectQuery("", config);
}
const SelectQuery = (keyword = undefined) => {
  if (keyword == undefined) return
  let { FIELD, DEFAULTVAL, CONTROLS, OTHER } = props.config;
  if (OTHER == "") return;
  let { url, data } = ParseOtherConfig(OTHER);
  if (url == "") return;
  SelectLoading.value = true; ``
  proxy.request({
    url: url,
    method: "post",
    data: {
      KEYWORD: keyword,
      MODULEID: MENUID,
      ...data,
    },
    headers: {
      repeatSubmit: false,
    },
  }).then(({ RESULT }) => {
    SelectOptions.value[FIELD] = RESULT;
    nextTick(() => {
      /** 自动查询 */
      if (autoSearchCTRL.includes(CONTROLS) && props.queryJson[FIELD] == 'auto' && DEFAULTVAL == 'auto' && RESULT.length > 0) {
        SelectChange(config, RESULT[0].VALUE)
      }
    })
  }).catch(() => {
    SelectOptions.value[FIELD] = [];
  }).finally(() => {
    SelectLoading.value = false;
  });
};

// 解析 Other 配置
function ParseOtherConfig(config) {
  if (!config) {
    SelectValueTo.value = []
    return { url: "", data: {}, importantData: {} };
  }
  try {
    let newConfig = JSON.parse(config)[0]
    if (newConfig.setvalue && JSON.stringify(newConfig.setvalue) != '{}') {
      let arr = []
      for (const key in newConfig.setvalue) {
        arr.push({ k: key, v: newConfig.setvalue[key] })
      }
      SelectValueTo.value = arr
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
        SelectValueTo.value = [];
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
        paramsArr[3] ? SelectValueTo.value = GetUrlParams("a?" + paramsArr[3], "arr") : []
      }
      return { url, data: queryJson, importantData };
    } else {
      console.error("配置解析错误!", error);
    }
  }
}

// 推断日期组件类型
const mapDateType = computed((isRange = false) => {
  return (isRange) => {
    let { SLOTCFG, SUFFIX } = props.config, Ctype = SLOTCFG || SUFFIX, type = "", format = "";
    switch (Ctype) {
      case "year":
        type = isRange ? 'daterange' : 'year'
        format = "YYYY"
        break;
      case "month":
        type = isRange ? 'monthrange' : 'month'
        format = "YYYY-MM"
        break;
      default:
        type = isRange ? 'daterange' : 'date'
        format = "YYYY-MM-DD"
        break;
    }
    return { type, format };
  }
})

function DateChange(val) {
  let { FIELD, CONTROLS } = props.config
  if (CONTROLS == 'ExDateRange' || CONTROLS == 'ExDateTimeRange') {
    props.queryJson[FIELD] = !val ? "" : val.join(",");
  } else {
    props.queryJson[FIELD] = !val ? "" : val
  }
  filterEvent()
}
</script>
<style lang="scss" scoped>
.custom-sort {
  color: #c0c4cc;
  cursor: pointer;
  position: static;
  left: 20px;
}
.custom-sort:hover {
  color: #333;
}
</style>