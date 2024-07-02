<template>
  <el-scrollbar :height="height" class="">
    <ul class="card-table" v-infinite-scroll="nextPage">
      <li v-for=" (row,index) in tableData" :key="index" class="card-table-item" @dblclick="openDetail(row)"
        @click.stop="onCheckBox(row,index)">
        <div class="header">
          <div class="left">
            <div class="title">
              <el-checkbox @click.native.prevent="cancelPrevent" v-model="row.CHECKED" size="large" />
              {{ row[ cardConfig.leftTop.value ] }}
            </div>
            <div class="time">
              {{ row[ cardConfig.leftTop.time ] }}
            </div>
          </div>

          <div class="right">
            {{ statusName( row[cardConfig.rightTop] , cardConfig.rightTop ).name }}
            <!-- <el-tag :type="statusName( row[cardConfig.rightTop] , cardConfig.rightTop ).color" effect="dark" >
            </el-tag> -->

          </div>

        </div>
        <div class="content line-style-wrap">
          <el-row>
            <el-col class="line-style-cell" :span="itemHtml.col*1 " v-for="(itemHtml, htminIn) in cardConfig.list "
              :key="htminIn">
              <span class="cell-label">{{ itemHtml.label }}： </span>

              <template v-if="itemHtml.isImg==1 ">
                <ImagePreview class="line-style-img" :src="row[itemHtml.id]" :width="20" :height="20" />
              </template>

              <template v-else-if="itemHtml.isLink">
                <el-link type="primary" @click.stop="linkEvent(itemHtml, row)">
                  {{ resetCellVal( row, itemHtml ).name }}
                </el-link>
              </template>

              <template v-else-if="resetCellVal( row, itemHtml ).color">
                <el-tag :type="resetCellVal( row, itemHtml ).color" effect="light" round>
                  {{ resetCellVal( row, itemHtml ).name }}
                </el-tag>
              </template>
              <span class="cell-value" v-else> {{ resetCellVal( row, itemHtml ).name }} </span>
            </el-col>
          </el-row>
        </div>
        <div class="footer">
          <el-row justify="end" :gutter="10">
            <el-col :span="2.5" v-for="(itemB, indexB) in tableToolsBTN" :key="indexB">
              <el-button :type="itemB.COLOR" plain v-if="setShowBtn(itemB, row)" :disabled="getButtonStatus(itemB, row)"
                @click.stop="handelEvent(itemB, row)">
                {{ itemB.VNAME }}
              </el-button>
            </el-col>
          </el-row>
        </div>

      </li>
    </ul>
  </el-scrollbar>
</template>

<script setup>
import {
  dict2name,
  setSuffix,
  getUrlParams,
  toThousands,
  evalFun,
} from "@/utils";

const props = defineProps({
  height: Number,
  tableData: Array,
  tableCFG: Object,
  cardConfig: Object,
  maxCol: String,
  tableToolsBTN: Array,
});
const { proxy } = getCurrentInstance();

const linkEvent = (data, row) => {
  if (!data.isLink) return null;
  let giveParentData = {
    clicktype: "openLink",
    linkCFG: data.isLink,
    data: row,
    getBtn: "1",
  };
  proxy.$emit("change", giveParentData);
};

function nextPage() {
  //  原计划自动翻页
}
//取消默认事件
function cancelPrevent() {
  return false
}
let checkboxArr = ref([])
const onCheckBox = (item, index) => {
  item.CHECKED = item.CHECKED ? false : true
  if (item.CHECKED) {
    checkboxArr.value.push(item)
  } else {
    checkboxArr.value.forEach((v, i, a) => {
      if (v.BILLNO == item.BILLNO) {
        checkboxArr.value.splice(i, 1)
      }
    });
  }
  let giveParentData = {
    clicktype: "checkbox",
    data: delChekdeTips(checkboxArr.value),
    checked: item.CHECKED,
    rowIndex: index,
  };
  proxy.$emit("change", giveParentData);
};
//CHECKED标识用完后删除
function delChekdeTips(val) {
  let checkboxArrCopy = JSON.parse(JSON.stringify(val))
  checkboxArrCopy.forEach(element => {
    delete element.CHECKED
  });
  return checkboxArrCopy
}
function openDetail(row) {
  let giveParentData = {
    clicktype: "detail",
    data: row,
  };
  proxy.$emit("change", giveParentData);
}

// 列表中的操作按钮
function handelEvent(btn, row) {
  if (btn.VTYPE == 28) {
    return openQrCode(btn, row);
  }
  let giveParentData = {
    clicktype: "clinkBTN",
    linkCFG: btn,
    data: row,
  };
  proxy.$emit("change", giveParentData);
}


// 操作栏按钮
const getButtonStatus = (item, row) => {
  let { SCRNCONDITION } = item;
  if (SCRNCONDITION && evalFun(row, SCRNCONDITION)) {
    return true;
  }
  return false;
};
// 设置是否显示按钮
const setShowBtn = computed((btn, row) => {
  return (btn, row) => {
    if (btn.ISSHOW == 0) return false;
    if (btn.ISSHOW == 1) return true;
    if (btn.ISSHOW == 2 && btn.OTHER) {
      try {
        return evalFun(row, btn.OTHER) || false;
      } catch (error) {
        console.error("setShowBtn", error);
      }
      return true;
    } else {
      return false;
    }
  };
});

// 提取表格的 value
function resetCellVal(row, config) {
  try {
    const { id, color } = config;

    if (!id.includes(",") && !id.includes("#")) {
      let newID = id.includes("$") ? id.replace("$", "") : id;
      return {
        name: row[newID],
        color: color,
      };
    }

    let newarr = id.split(","),
      newStr = "",
      colors = "";
    newarr.forEach((item) => {
      if (item.includes("$")) {
        //拼接变量
        let fileid = item.replace("$", "");
        newStr = newStr.concat(row[fileid]);
      } else if (item.includes("#")) {
        //拼接字典
        let fileid = item.replace("#", "");
        let arr = props.tableCFG.allColumns.filter(
          (ele) => ele.FIELD == fileid
        );
        if (arr.length == 0 || !arr[0].OTHER) return;

        if (row[fileid]) {
          let newOther = JSON.parse(arr[0].OTHER);
          newStr = newStr.concat(DictLabels(newOther, row[fileid]));
        }
        colors = dict2name(arr[0].OTHER, row[fileid]).color || "";
      } else {
        newStr = newStr.concat(item);
      }
    });
    return {
      name: newStr,
      color: colors,
    };
  } catch (error) {
    console.error("resetCellVal异常", error);
  }
}

const statusName = (val, fileid) => {
  let newStr = "",
    colors = "";
  let arr = props.tableCFG.allColumns.filter((ele) => ele.FIELD == fileid);
  if (arr.length == 0 || !arr[0].OTHER) return;

  if (val) {
    let newOther = JSON.parse(arr[0].OTHER);
    newStr = newStr.concat(DictLabels(newOther, val));
  }
  colors = dict2name(arr[0].OTHER, val).color || "";
  return {
    name: newStr,
    color: colors,
  };
};

// 多个字典拼接
const DictLabels = (arr, data, jg = ",", label = "LABEL", value = "VALUE") => {
  arr = arr == undefined ? [] : arr;
  return proxy.selectDictLabels(arr, data, jg, label, value);
};
</script>

<style lang="scss" scoped>
.card-table {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;

  &-item {
    width: calc(v-bind(maxCol) - 10px);
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    position: relative;
    padding: 10px;
    margin-right: 10px;

    .header {
      .title {
        font-weight: 600;
      }

      .time {
        font-size: 14px;
        color: var(--el-color-info);
        padding-top: 4px;
      }

      .right {
        position: absolute;
        right: 0;
        top: 0;
        padding: 5px 10px;
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        font-size: 14px;
      }
    }

    .content {
      padding: 10px 0;
    }
  }
}

.line-style-wrap {
  .cell-label {
    color: #8a8e99;
  }

  .cell-value {
    color: #333;
    font-weight: 400;
  }

  .line-style-cell {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-bottom: 4px;
  }
}
</style>
