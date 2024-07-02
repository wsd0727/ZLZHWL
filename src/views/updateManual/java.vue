<template>
  <div class="manual-app">
    <el-row>
      <el-col :span="4">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <p style="text-align: center">后端更新手册</p>
            </div>
            <el-input
              v-model="input3"
              class="w-50 m-2"
              size="small"
              placeholder="请输入关键字"
            >
              <template #append>
                <el-button :icon="Search" @click="searchValue(input3)" />
              </template>
            </el-input>
          </template>
          <el-scrollbar :height="leftHight">
            <div v-for="(item, index) in options" :key="index" class="leftText">
              <p
                @click="leftTextClick(item.BILLNO, item.VNAME, index)"
                :class="{ lside: sideIndex == item.BILLNO }"
              >
                {{ item.VNAME }}
              </p>
            </div>
          </el-scrollbar>
        </el-card></el-col
      >
      <el-col :span="20">
        <el-card class="box-card">
          <!-- <template #header> -->
          <div class="card-header">
            <div class="button-item prevIcon">
              <div
                class="leftIcon"
                v-if="titleIndex > 0"
                @click="iconClick(titleIndex - 1)"
              >
                <el-icon><ArrowLeftBold /></el-icon>
                <p>{{ prevTitle }}</p>
              </div>
            </div>
            <div>版本号：{{ vname }}</div>
            <div class="button-item nextIcon">
              <div
                class="rightIcon"
                v-if="titleIndex < options.length - 1"
                @click="iconClick(titleIndex + 1)"
              >
                <p>{{ nextTitle }}</p>
                <el-icon><ArrowRightBold /></el-icon>
              </div>
            </div>
          </div>
          <!-- </template> -->
          <el-scrollbar :height="Hight">
            <el-container>
              <el-main>
                <div class="rightText">
                  <div class="rightUser mce-content-body">
                    <div class="textContent" v-html="textContent"></div>
                  </div></div
              ></el-main>
              <el-footer>
                <div class="card-footer" v-if="textContent != ''">
                  <div class="button-item prevIcon">
                    <div
                      class="leftIcon"
                      v-if="titleIndex > 0"
                      @click="iconClick(titleIndex - 1)"
                    >
                      <el-icon><ArrowLeftBold /></el-icon>
                      <p>{{ prevTitle }}</p>
                    </div>
                  </div>
                  <!-- <span>版本号：3.0.23021101</span> -->
                  <div class="button-item nextIcon">
                    <div
                      class="rightIcon"
                      v-if="titleIndex < options.length - 1"
                      @click="iconClick(titleIndex + 1)"
                    >
                      <p>{{ nextTitle }}</p>
                      <el-icon><ArrowRightBold /></el-icon>
                    </div>
                  </div></div
              ></el-footer>
            </el-container>
          </el-scrollbar> </el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script setup>
const sideIndex = ref();
const Hight = window.innerHeight - 195;
const leftHight = window.innerHeight - 223;
import { Search } from "@element-plus/icons-vue";
import { LeftList, RightList } from "#/system/log";
import { computed } from "@vue/runtime-core";
const input3 = ref("");
const options = ref([]);
const textContent = ref("");
const vname = ref("");
const titleIndex = ref(0);
const prevTitle = computed(() => {
  if (titleIndex.value == 0) return "";
  vname.value = options.value[titleIndex.value]["VNAME"];
  return options.value[titleIndex.value - 1]["VNAME"];
});
const nextTitle = computed(() => {
  if (titleIndex.value == options.value.length - 1) return "";
  vname.value = options.value[titleIndex.value]["VNAME"];
  return options.value[titleIndex.value + 1]["VNAME"];
});
const iconClick = (index) => {
  sideIndex.value = options.value[index]["BILLNO"];
  titleIndex.value = index;
  getRightList();
};
function searchValue(value) {
  input3.value = value;
  getLeftList();
}
function leftTextClick(value, name) {
  sideIndex.value = value;
  vname.value = name;
  titleIndex.value = options.value.findIndex((el) => el.BILLNO == value);
  getRightList();
}
function getRightList() {
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    PAGENUM: 1,
    PAGESIZE: 20,
    SORTNAME: "",
    REVERSE: "",
    BILLNO: sideIndex.value,
    KEY: "",
    MODULEID: "MU230202669891",
    PAGEID: "PG230202668348",
    VERSION: "",
  };
  RightList(data).then((res) => {
    textContent.value = res.RESULT.CONTENT;
  });
}
function leftIconClick() {
  for (let index = 0; index < options.value.length; index++) {
    if (sideIndex.value == options.value[index].BILLNO) {
      vname.value = index != 0 ? options.value[index - 1].VNAME : "";
    }
  }
  if (sideIndex.value != "") {
    getRightList();
  }
}
function rightIconClick() {
  for (let index = 0; index < options.value.length; index++) {
    if (sideIndex.value == options.value[index].BILLNO) {
      vname.value =
        options.value.length - 1 != index ? options.value[index + 1].VNAME : "";
    }
  }
  sideIndex.value = rightID.value;
  if (sideIndex.value != "") {
    getRightList();
  }
}
function getLeftList() {
  let data = {
    APPID: "",
    VNAME: "",
    DR: "0",
    PAGENUM: 1,
    PAGESIZE: 20,
    SORTNAME: "",
    REVERSE: "",
    KEY: "",
    VNAME: input3.value,
    MODULEID: "MU230202669891",
    PAGEID: "PG230202619293",
    VTYPE: "1",
    VERSION: "",
  };
  LeftList(data).then((res) => {
    options.value = res.RESULT.RECORDS;
    vname.value = options.value.length != 0 ? options.value[0].VNAME : "";
    sideIndex.value = options.value.length != 0 ? options.value[0].BILLNO : "";
    // findIndex((element) => { /* … */ } )
    getRightList();
  });
}
getLeftList();
</script>

<style lang="scss" scoped>
.manual-app {
  margin-top: 6px;
  .el-col-4 {
    padding: 0px !important;
    // height: 620px;
    float: left;
    display: block;
    box-sizing: border-box;
    .box-card {
      width: 100%;
      // height: 620px;
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          font-size: 14px;
          font-weight: 600;
        }
      }
      .leftText {
        p {
          font-size: 14px;
          margin: 0 0 10px;
          // color: rgb(51, 51, 51);
          font-family: "Microsoft Yahei", Tahoma, Helvetica, Arial, Verdana,
            宋体, sans-serif;
          cursor: pointer;
        }
      }
    }
  }
  .el-col-20 {
    padding: 0px 0px 0px 5px !important;
    .box-card {
      width: 100%;
      .card-header {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e4e7ed;
        div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
        }
      }
      .button-item {
        width: 110px;
        cursor: pointer;
        .leftIcon {
          font-size: 14px;
          display: inline-block;
          font-weight: 600;
          position: relative;
          top: -2px;
          left: 5px;
        }
        .rightIcon {
          font-size: 14px;
          display: inline-block;
          font-weight: 600;
          position: relative;
          top: -2px;
          left: 5px;
        }
      }
      .prevIcon {
        text-align: left;
      }
      .nextIcon {
        text-align: right;
      }
      .rightText {
        margin-bottom: 10px;
        position: relative;
        left: 10px;
        span {
          display: inline-block;
          font-size: 16px;
          margin: 0px 0px 10px 10px;
        }
        p {
          margin: 0 0 10px 30px;
          font-family: arial, helvetica, sans-serif;
          font-size: 14px;
          line-height: 1.42857143;
          color: #333;
        }
        .rightUser {
          display: inline-block;
          float: left;
          font-weight: 600;
          margin-right: 5px;
          span {
            font-size: 14px;
          }
        }
        .textContent {
          width: 100%;
          margin-top: 20px;
          span {
            font-weight: 700;
            font-size: 14px;
          }
          p {
            font-size: 14px;
            margin: 0 0 10px 30px;
            color: rgb(51, 51, 51);
            font-family: "Microsoft Yahei", Tahoma, Helvetica, Arial, Verdana,
              宋体, sans-serif;
          }
        }
      }
      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 50px;
        p {
          text-align: left;
          font-weight: 600;
        }
        span {
          font-weight: 600;
        }
      }
    }
  }
  .leftIcon {
    p {
      font-size: 14px;
      display: inline-block;
      font-weight: 600;
      position: relative;
      top: -2px;
      left: 5px;
    }
  }
  .rightIcon {
    p {
      font-size: 14px;
      display: inline-block;
      font-weight: 600;
      position: relative;
      top: -2px;
      right: 5px;
    }
  }
  .lside {
    color: #46b8da;
    font-weight: 600;
    // background-color: #46b8da;
  }
}
</style>
<style scoped>
.mytable-scrollbar ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
/*滚动条的轨道*/
.mytable-scrollbar ::-webkit-scrollbar-track {
  background-color: #ffffff;
}
/*滚动条里面的小方块，能向上向下移动*/
.mytable-scrollbar ::-webkit-scrollbar-thumb {
  background-color: #bfbfbf;
  border-radius: 5px;
  border: 1px solid #f1f1f1;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.mytable-scrollbar ::-webkit-scrollbar-thumb:hover {
  background-color: #a8a8a8;
}
.mytable-scrollbar ::-webkit-scrollbar-thumb:active {
  background-color: #787878;
}
/*边角，即两个滚动条的交汇处*/
.mytable-scrollbar ::-webkit-scrollbar-corner {
  background-color: #ffffff;
}
</style>
