<!--
 * @Author: cc2049
 * @Date: 2024-02-20 09:00:04
 * @LastEditors: PiPin 33947354+p1Master@users.noreply.github.com
 * @LastEditTime: 2024-06-21 19:28:38
 * @Description: 简介
-->

<template>
  <span @click="handleSort(column)">{{ column.title || '' }} </span>
  <el-popover placement="bottom" :width="config.WIDTH" trigger="click" v-if="config.filterCfg">

    <template #reference>
      <span class="custom-sort">
        <i class="vxe-icon-funnel"></i>
      </span>
    </template>

    <el-input v-if="config.filterCfg.CONTROLS == 'ExTextBox' " v-model="tableCFG.queryJson[config.FIELD]" @keydown.enter="filterEvent" clearable />

    <template v-else-if="config.filterCfg.CONTROLS == 'ExSelect'">
      <el-select placeholder=" " v-model="tableCFG.queryJson[config.FIELD]" clearable style="width: 100%" @change="filterEvent">
        <el-option v-for="itemST in tableCFG.queryJson.EnumData[config.FIELD]" :key="itemST.VALUE" :label="itemST.LABEL" :value="itemST.VALUE" />
      </el-select>
    </template>

    <template v-else-if="config.filterCfg.CONTROLS == 'ExSelectMultiple'">
      <el-select placeholder=" " v-model="tableCFG.queryJson[config.FIELD+'Arr']" clearable multiple collapse-tags collapse-tags-tooltip style="width: 100%" @change="(val) => SelectChange(config.filterCfg, val)">
        <el-option v-for="itemST in tableCFG.queryJson.EnumData[config.FIELD]" :key="itemST.VALUE" :label="itemST.LABEL" :value="itemST.VALUE" />
      </el-select>
    </template>

    <template v-else-if="config.filterCfg.CONTROLS == 'ExSelectSearch'">
      <el-select v-model="tableCFG.queryJson[config.filterCfg.FIELD]" clearable filterable remote remote-show-suffix :remote-method="(val) => SelectQuery(val, config.filterCfg)" :loading="SelectLoading" placeholder=" " @focus="SelectFocus( config.filterCfg )" @change="(val) => SelectChange(config.filterCfg, val)" @clear="SelectChange" @keydown.enter="enterNextEl">
        <el-option v-for="itemST in tableCFG.queryJson.EnumData[config.filterCfg.FIELD]" :key="itemST.VALUE" :label="itemST.LABEL" :value="itemST.VALUE" style="max-width:300px" />
      </el-select>
    </template>

    <template v-else-if="config.filterCfg.CONTROLS == 'ExSelectMutiple'">
      <el-select v-model="tableCFG.queryJson[config.filterCfg.FIELD+'Arr']" clearable multiple collapse-tags collapse-tags-tooltip filterable remote remote-show-suffix :remote-method="(val) => SelectQuery(val, config.filterCfg)" :loading="SelectLoading" placeholder=" " @focus="SelectFocus( config.filterCfg )" @change="(val) => SelectChange(config.filterCfg, val)" @clear="SelectChange" @keydown.enter="enterNextEl">
        <el-option v-for="itemST in tableCFG.queryJson.EnumData[config.filterCfg.FIELD]" :key="itemST.VALUE" :label="itemST.LABEL" :value="itemST.VALUE" style="max-width:300px" />
      </el-select>
    </template>

    <!-- ExSelectGroup 分组选择  -->
    <!-- <template v-else-if="config.filterCfg.CONTROLS == 'ExSelectGroup'">
      <el-tree-select v-model="tableCFG.queryJson[config.filterCfg.FIELD]" clearable filterable remote-show-suffix remote :remote-method="val => SelectQuery(val, config.filterCfg)" :loading="SelectLoading" :data="tableCFG.queryJson.EnumData[config.filterCfg.FIELD]"
        @focus="SelectFocus(config.filterCfg)" @change="(val) => SelectChange(config.filterCfg, val)" @clear="SelectChange(config.filterCfg, null)" style="width: 100%" popper-class="popMaxWidth" :render-after-expand="false" :placeholder="' '"
        :props="{ label: 'LABEL', children: 'CHILDREN' , disabled: 'ISDISABLED', }" value-key="VALUE" highlightCurrent />
    </template> -->

    <!-- ExDateRange 日期区间 -->
    <!-- <el-date-picker v-else-if="config.filterCfg.CONTROLS == 'ExDateRange'" @clear="DateChange(null,config.filterCfg)" @change="(v) => DateChange(v, config.filterCfg)" v-model="tableCFG.queryJson[config.FIELD+'Arr']" unlink-panels clearable :type="mapDateType(config.filterCfg ,true).type"
      range-separator="至" :value-format="mapDateType(config.filterCfg,true).format" style="width: 100%" /> -->

    <!-- ExDateTime 日期时间选择  -->
    <!-- <el-date-picker v-else-if="config.filterCfg.CONTROLS == 'ExDateTime'" v-model="tableCFG.queryJson[config.FIELD]" clearable @clear="DateChange(null,config.filterCfg)" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" @change="(v)=>DateChange(v,config.filterCfg)" /> -->

    <!-- ExDateTimeRange 日期时间区间 -->
    <!-- <el-date-picker v-else-if="config.filterCfg.CONTROLS == 'ExDateTimeRange'" @change="(v) => DateChange(v, config.filterCfg)" v-model="tableCFG.queryJson[config.FIELD+'Arr']" clearable @clear="DateChange(null,config.filterCfg)" unlink-panels :prefix-icon="9" type="datetimerange"
      range-separator="至" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" /> -->

  </el-popover>
</template>

<script setup>
const props = defineProps({
  column: {
    type: Object,
    default: () => { },
  },
  config: {
    type: Object,
    default: () => { },
  },
  tableCFG: {
    type: Object,
    default: () => { },
  },
});

const emit = defineEmits(["filterEvent", "handleSortEvent"]);
const { proxy } = getCurrentInstance();

const filterEvent = () => {
  emit("filterEvent");
};

const handleSort = (column) => {
  emit("handleSortEvent", column);
}

// 下拉查询事件
const SelectLoading = ref(false);
const SelectValueTo = ref(null);
const SelectFocus = (config) => {
  SelectQuery("", config);
};

const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;

const SelectQuery = (keyword = undefined, config) => {
  if (keyword == undefined) return;
  let { FIELD, DEFAULTVAL, CONTROLS, OTHER } = config;
  if (OTHER == "") return;
  let { url, data } = ParseOtherConfig(OTHER);
  if (url == "") return;
  SelectLoading.value = true;
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
  })
    .then(({ RESULT }) => {
      props.tableCFG.queryJson.EnumData[FIELD] = RESULT;
    })
    .catch(() => {
      props.tableCFG.queryJson.EnumData[FIELD] = [];
    })
    .finally(() => {
      SelectLoading.value = false;
    });
};

const SelectChange = (config, val) => {
  console.log(11, config, val);
  if (Array.isArray(val)) {
    props.tableCFG.queryJson[config.FIELD] = String(val)
  }
  filterEvent();
};

// 解析 Other 配置
function ParseOtherConfig(config) {
  if (!config) {
    SelectValueTo.value = [];
    return { url: "", data: {}, importantData: {} };
  }
  try {
    let newConfig = JSON.parse(config)[0];
    if (newConfig.setvalue && JSON.stringify(newConfig.setvalue) != "{}") {
      let arr = [];
      for (const key in newConfig.setvalue) {
        arr.push({ k: key, v: newConfig.setvalue[key] });
      }
      SelectValueTo.value = arr;
    }
    return {
      url: newConfig.url,
      data: newConfig?.params,
      importantData: newConfig?.importantData,
    };
  } catch (error) {
    if (config.indexOf("/") == "0") {
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
          queryJson = obj;
          importantData = importantObj;
        }
        if (paramsArr.length > 2) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[2], "obj");
          setQueryParam = obj;
          setImportantParam = importantObj;
          queryJson = { ...queryJson, ...ConvertData(setQueryParam) };
          importantData = {
            ...importantData,
            ...ConvertData(setImportantParam),
          };
        }
        SelectValueTo.value = paramsArr[3] ? GetUrlParams("a?" + paramsArr[3], "arr") : [];
      }
      return { url, data: queryJson, importantData };
    } else {
      console.error("配置解析错误!", error);
    }
  }
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

/** 转换数据 */
function ConvertData(obj) {
  let data = {};
  for (let ii in obj) {
    let valueKey = obj[ii];
    if (valueKey.includes("M$")) {
      valueKey = calcHasMSKey(valueKey);
      data[ii] = props.mainFormData[valueKey] || "";
    } else if (valueKey.includes("S$")) {
      valueKey = calcHasMSKey(valueKey);
      data[ii] = props.formData[valueKey] || "";
    } else {
      data[ii] = props.formData[valueKey] || "";
    }
  }
  return data;
}

// 推断日期组件类型
const mapDateType = computed((config, isRange = false) => {
  return (config, isRange) => {
    let { SLOTCFG, SUFFIX } = config,
      Ctype = SLOTCFG || SUFFIX,
      type = "",
      format = "";
    switch (Ctype) {
      case "year":
        type = isRange ? "daterange" : "year";
        format = "YYYY";
        break;
      case "month":
        type = isRange ? "monthrange" : "month";
        format = "YYYY-MM";
        break;
      default:
        type = isRange ? "daterange" : "date";
        format = "YYYY-MM-DD";
        break;
    }
    return { type, format };
  };
});
</script>

<style lang="scss">
.custom-sort {
  color: #c0c4cc;
  cursor: pointer;
  position: relative;
  left: 20px;
}
.custom-sort:hover {
  color: #333;
}
</style>