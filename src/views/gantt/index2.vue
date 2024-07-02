<template>
  <div class="gantt-warp">
    <div class="query-wrap bg-white">
      <el-row class="row-bg" justify="space-between">
        <el-col :span="20">
          <Form
            class="query-form"
            ref="formRefTop"
            v-model:formData="queryJson"
            :formConfig="queryConfig"
            :inline="true"
            @select="formSelect"
          />
        </el-col>
        <el-col :span="4" class="flex-row-end">
          <el-button @click="queryEvent" type="primary"> 查找 </el-button>
          <!-- <el-button @click="openQuery"> 高级 </el-button> -->
        </el-col>
      </el-row>
    </div>

    <div class="gantt-main bg-white">
      <div class="gantt-btn mb5">
        <el-button @click="add"> 新增 </el-button>
        <el-button @click="setEdit"> 开始编辑 </el-button>
        <el-button @click="openQuery" type="primary"> 保存 </el-button>
      </div>
      <el-scrollbar width="100%" v-if="ganttConfig.STARTTIME">
        <g-gantt-chart
          :chart-start="ganttConfig.STARTTIME"
          :chart-end="ganttConfig.ENDTIME"
          precision="hour"
          width="100%"
          bar-start="START"
          bar-end="END"
          locale="zh-cn"
          color-scheme="vue"
          font="Calibri"
          push-on-overlap
        >
          <g-gantt-row
            :label="item.ROWNAME"
            :bars="item.CHILDRENS"
            v-for="item in ganttConfig.ROW"
            :key="item.ID"
          />
        </g-gantt-chart>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup name="gantt2">
import { getGanttData } from "@/api/gantt";
import dayjs from "dayjs";

const isEdit = ref(false);

const bar = ref({
  myBeginDate: "2021-07-11 10:00",
  myEndDate: "2021-07-11 20:00",
  ganttBarConfig: {
    id: "some-id-blabla", // make sure this is unique!
    label: "生产工序", // bar 里面的标题
    hasHandles: true, // 开启允许调整宽度
    immobile: false, // 图形是否禁止拖动
    // bundle:'1' ,
    style: {
      background: "#e09b69",
      borderRadius: "20px",
      color: "black",
    },
  },
});

const ganttConfig = ref({});

const rowList = ref();
//   [
//   {
//     label: "炉次1",
//     id: 1,
//     myBarList: [bar.value],
//   },
//   {
//     id: 2,
//     label: "炉次2",
//     myBarList: [bar.value],
//   },
//   {
//     id: 3,
//     label: "炉次3",
//     myBarList: [bar.value],
//   },
// ]

const queryJson = ref({});
const queryConfig = ref([]);

const formSelect = () => {
  // console.log(123);
};

const add = () => {
  const newbar = {
    myBeginDate: "2021-07-12 10:00",
    myEndDate: "2021-07-12 20:00",
    ganttBarConfig: {
      id: "a22", // make sure this is unique!
      label: "生产工序", // bar 里面的标题
      hasHandles: true, // 开启允许调整宽度
      immobile: false, // 图形是否禁止拖动
      // bundle:'1' ,
      style: {
        background: "#5f9ea0",
        borderRadius: "20px",
        color: "black",
      },
    },
  };
  rowList.value[0].myBarList.push(newbar);
};

const setEdit = () => {
  isEdit.value = true;
};

getPageData();

function getPageData() {
  let data = {};
  getGanttData(data).then((res) => {
    res.STARTTIME = dayjs(res.STARTTIME).format("YYYY-MM-DD HH:mm");
    res.ENDTIME = dayjs(res.ENDTIME).format("YYYY-MM-DD HH:mm");
    res.ROW.forEach((item) => {
      item.CHILDRENS.forEach((itemS) => {
        (itemS.START = dayjs(itemS.START).format("YYYY-MM-DD HH:mm")),
          (itemS.END = dayjs(itemS.END).format("YYYY-MM-DD HH:mm")),
          (itemS.ganttBarConfig = {
            id: guid2(), // make sure this is unique!
            label: itemS.NAME, // bar 里面的标题
            hasHandles: true, // 开启允许调整宽度
            immobile: false, // 图形是否禁止拖动
            // bundle:'1' ,
            style: {
              background: itemS.COLOR,
              borderRadius: "20px",
              color: "black",
            },
          });
      });
    });
    // console.log(res);
    ganttConfig.value = res;
  });
}

function guid2() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}
</script>

<style lang="scss">
.gantt-warp {
  width: 100%;
  margin-top: 10px;
  .query-wrap {
    padding: 8px;
    background-color: #fff;
    margin-bottom: 6px !important;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .gantt-main {
    padding: 8px;
    border-radius: 4px;
    .gantt-btn {
    }
  }
}
</style>
