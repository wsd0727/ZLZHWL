<template>
  <!-- 列配置 -->
  <el-drawer v-model="colDrawer" title="列配置" :size="500">
    <div class="col-wrap">
      <p>已显示字段</p>
      <draggable :list="tableColumns" ghost-class="ghost" :force-fallback="true" chosen-class="chosenClass" animation="300" @start="onStart" @end="onEnd">
        <template #item="{ element, index }">
          <el-tag closable effect="plain" :title="element.LABEL" class="col-tab ellipsis" size="large" @close="closeTab(index)" v-if="element.SELECTEDFLAG == 1">
            {{ element.LABEL }}
          </el-tag>
        </template>
      </draggable>
      <p style="margin-top: 20px">可选字段</p>
      <template v-for="(itemCol, index) in tableColumns" :key="itemCol.BILLNO">
        <el-tag effect="plain" class="col-tab" size="large" @close="closeTab(index)" v-if="itemCol.SELECTEDFLAG != 1">
          {{ itemCol.LABEL }}
          <el-icon @click="closeTab(index, 1)">
            <Plus />
          </el-icon>
        </el-tag>
      </template>

      <p v-if="hasTemplate">模板设置</p>
      <template v-for="(item, index) in templateList" :key="index">
        <el-tag effect="plain" class="mr10" size="large" :type="item.VALUE == selectTemp ? '' : 'info'" @click="selectTemplate(item)">
          {{ item.LABEL }}
        </el-tag>
      </template>
    </div>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="restBtn" size="default">重置</el-button>
        <el-button type="primary" @click="saveColConfig" size="default">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup name="">
import { axiosSave } from "@/api/system/page";
import draggable from "vuedraggable";
import { restClick } from "@/api/system/page";
import TextOverflow from "@/components/TextOverflow";
import localforage from "localforage";

const emit = defineEmits(["reloadPage"]);

const props = defineProps({
  PAGE: String,
  ListTableData: Object,
});
const { proxy } = getCurrentInstance();

const colDrawer = ref(false);
const tableColumns = ref([]);
const templateList = ref([]);
const selectTemp = ref("");
const hasTemplate = ref(false);
const menuConfig = ref(null);

function openDrawer(hasTemp, queryTem, allColumns) {
  menuConfig.value = queryTem;
  getTemplate(queryTem);
  hasTemplate.value = hasTemp;
  // if (hasTemp) {
  //   hasTemplate.value = hasTemp;
  //   getTemplate(queryTem);
  // } else {
  //   tableColumns.value = allColumns;
  // }
  colDrawer.value = true;
}

function getTemplate(queryTem) {
  axiosSave("/sys/selectConfig/getList", queryTem).then((res) => {
    let { TEMPLIST } = res.RESULT;
    templateList.value = TEMPLIST;
    let idArr = TEMPLIST.filter((i) => i.ISDETAULT == 1);
    selectTemp.value = idArr.length ? idArr[0].VALUE : null;
    getColumnsList(res.RESULT);
  });
}

// 关闭
function closeTab(i, t) {
  if (t == 1) {
    tableColumns.value[i].SELECTEDFLAG = "1";
  } else {
    tableColumns.value[i].SELECTEDFLAG = "0";
  }
}
//开始拖拽事件
function onStart() {}
//结束拖拽事件
function onEnd() {}

function restBtn() {
  let data = {
    MODULEID: menuConfig.value.MODULEID,
    PAGEID: menuConfig.value.PAGEID,
    BILLNO: selectTemp.value || "0",
  };
  restClick(data)
    .then((res) => {
      colDrawer.value = false;
      ElMessage({
        message: "重置成功",
        type: "success",
      });
      emit("reloadPage", {});
    })
    .catch((err) => {
      ElMessage({
        message: "重置失败",
        type: "success",
      });
    });
}

// 判断是否包含模板
function saveColConfig() {
  let data = {
    MODULEID: menuConfig.value.MODULEID,
    PAGEID: menuConfig.value.PAGEID,
    BILLNO: selectTemp.value || "0",
    ENGNAMESINFO: "",
    NOTSHOWINFO: "",
  };
  let ArrList = tableColumns.value.filter((i) => {
    return i.SELECTEDFLAG == 1;
  });

  let ArrList2 = tableColumns.value.filter((i) => {
    return i.SELECTEDFLAG == 0;
  });

  let newData = ArrList.map((i) => {
    return i.FIELD;
  }).join(",");

  let newData2 = ArrList2.map((i) => {
    return i.FIELD;
  }).join(",");
  data.ENGNAMESINFO = newData;
  data.NOTSHOWINFO = newData2;
  axiosSave("/sys/selectConfig/insert", data).then((res) => {
    proxy.$modal.msgSuccess("提交成功");
    colDrawer.value = false;
    clearCache(data);
    emit("reloadPage", {});
  });
}

function clearCache(data) {
  localforage.keys().then(function (keys) {
    keys.forEach((i) => {
      if (i.includes(data.MODULEID)) {
        localforage.removeItem(i);
      }
    });
  });
}

// 模板选中后
const selectTemplate = (temp) => {
  selectTemp.value = temp.VALUE;
  let data = {
    MODULEID: menuConfig.value.MODULEID,
    PAGEID: menuConfig.value.PAGEID,
    BILLNO: temp.VALUE,
  };
  axiosSave("/sys/selectConfig/getColumnById", data).then((res) => {
    getColumnsList(res.RESULT);
  });
};

function getColumnsList(data) {
  let { TEMPLIST, ENGNAMESINFO, CHANAMESINFO, CHINASHOWINFO, NOTSHOWINFO } =
    data;
  // 设置已选模板的状态
  let showColIDArr = ENGNAMESINFO?.split(","),
    showColNameArr = CHANAMESINFO?.split(","),
    noShowColIDArr = NOTSHOWINFO ? NOTSHOWINFO?.split(",") : [],
    noShowColNameArr = CHINASHOWINFO?.split(",");

  let newArr = [];
  if (!showColIDArr?.length) return;
  showColIDArr.forEach((item, index) => {
    let newItem = {
      LABEL: showColNameArr[index],
      FIELD: item,
      SELECTEDFLAG: 1,
    };
    newArr.push(newItem);
  });
  if (noShowColIDArr.length) {
    noShowColIDArr.forEach((item, index) => {
      let newItem = {
        LABEL: noShowColNameArr[index],
        FIELD: item,
        SELECTEDFLAG: 0,
      };
      newArr.push(newItem);
    });
  }
  tableColumns.value = newArr;
}

// 主动暴露方法
defineExpose({ openDrawer });
</script>

<style scoped>
.col-tab {
  /* width: 100px; */
  margin: 10px 5px;
}
/* :deep(.el-tag__content) {
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
} */
</style>
