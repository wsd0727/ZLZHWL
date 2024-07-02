<template>
  <el-drawer v-model="noticeDrawer" modal-class="notice-modal" close-on-click-modal :with-header="false" title="通知" direction="rtl" size="400px" custom-class="notice-drawer">
    <el-icon class="closeDrawer" @click="clickCloseDrawer">
      <Close />
    </el-icon>
    <el-tabs v-model="activeName" class="demo-tabs notic" @tab-change="queryNoticeData">
      <el-tab-pane label="预警" name="1" />
      <el-tab-pane label="公告" name="4" v-if="systemConfig?.systemCode != 'ZLZHWL'" />
    </el-tabs>
    <div class="notic list">
      <el-scrollbar :height="scrollHeight">
        <el-empty v-if="!noticeList.length" description="暂无消息" />
        <template v-else>
          <div class="all" v-if="activeTabs.path" @click="openMenu()">查看全部</div>
          <div class="notic-content content" v-for="item in noticeList" :key="item.BILLNO" @click="goToDetail(item)">
            <div class="notic-content-warntime">{{item.WARNTIME}}</div>
            <div class="content-item" v-if="activeName == '1'">
              <div class="notic-content-title" :class="{'unread':item.READFLAG!=1}">
                <img :src="YJicon" alt="" srcset="" class="titleImg">
                {{item.VNAME}}预警
              </div>
              <p class="notic-content-text">运单{{ item.BILLNO}},车辆{{item.CARNO}},{{item.WARNTIME}}{{item.VNAME}}</p>
            </div>
            <div class="content-item" v-else-if="activeName == '4'">
              <div class="notic-content-title" style="color: #32A878;" :class="{'unread':item.READFLAG!=1}">
                <img :src="GGicon" alt="" srcset="" class="titleImg">
                系统公告
              </div>
              <p class="notic-content-text">运单{{ item.BILLNO}},车辆{{item.CARNO}},{{item.WARNTIME}}{{item.VNAME}}</p>
            </div>
          </div>
        </template>
      </el-scrollbar>
    </div>
  </el-drawer>

  <el-dialog v-model="visibleDeatil" :title=" detailTitle" width="50%" :height="400">
    <template v-if="activeName==1">
      <div>
        <p>运单：{{ detailData.BILLNO}}</p>
        <p>司机： {{ detailData.DRIVERNAME}} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; 车辆：{{detailData.CARNO}}</p>
        <p>预警： {{detailData.WARNTIME}}{{detailData.VNAME}}</p>
        <p>
          内容：
          <span class="html-wrap" v-html="detailData.EXCEPTIONINFO">
          </span>
        </p>
        <div class="img-wrap">
          <ImagePreview :src="detailData.PICURL1" />
        </div>

        <ol v-if="detailData.SUBLIST?.length">
          <li v-for="item in detailData.SUBLIST" :key="item.BILLNO">
            <div class="time">时间：{{ item.WARNTIME  }}</div>
            <div class="time">地点：{{ item.LOCATION  }}</div>
          </li>
        </ol>
      </div>
    </template>

    <template v-if="activeName==4">
      <h2 class="text-center"> {{ detailData.TITLE  }} </h2>
      <div class="html-wrap" v-html="detailData.CONTENT">
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { queryNoticeByUrl, queryUnRead } from "#/common";
import useSettingsStore from "@/store/modules/settings";
const settingsStore = useSettingsStore();
const systemConfig = computed(() => settingsStore.systemConfig);
const systemName = computed(() => systemConfig.value.title);
const emit = defineEmits(["setUnReadData"]);
const noticeList = ref([]);
// 1-预警消息2-货源公告3招标公告4-系统公告
const router = useRouter();

const { proxy } = getCurrentInstance();

const scrollHeight = computed(() => window.innerHeight - 85);

const activeName = ref("1");

const noticeDrawer = ref(false);

const urlList = [
  // 1-预警消息 2-货源公告 3招标公告 4-系统公告
  {
    id: "1",
    name: "预警消息",
    url: "/tms/tmsWarninfoMsg/getPageList",
    path: "/tms/warninfo",
  },
  {
    id: "2",
    name: "货源公告",
    url: "/oms/goodsSource/getSpecialAppGoodSource",
    path: "",
  },
  {
    id: "3",
    name: "招标公告",
    url: "/oms/tenderNotice/app/getTenderNoticeInfo",
    path: "",
  },
  { id: "4", name: "系统公告", url: "/sys/notice/getSysMessage", path: "" },
];
const activeTabs = computed(() => {
  return urlList.find((el) => el.id == activeName.value);
});

const YJicon = ref(proxy.getAssetsFile("scm/notic/notic1.png"));
const GGicon = ref(proxy.getAssetsFile("scm/notic/notic3.png"));

const detailData = ref({});
const visibleDeatil = ref(false);
const detailTitle = ref("");
const ImgList = ref([]);
// 设置已读
const goToDetail = (item) => {
  detailData.value = item;
  emit("setUnReadData");

  // console.log(666, item);
  if (activeName.value == 1) {
    item.READFLAG == 0 ? setRead(item) : openDetail(item);
    detailTitle.value = item.VNAME +    "预警";
    ImgList.value = item.PICURL1.split(",");
  } else {
    detailTitle.value = "系统公告";
  }
};
const setRead = (item) => {
  // 1-预警消息2-货源公告3招标公告4-系统公告
  let portData = {
    MESSAGEID: item.BILLNO,
    MESSAGETYPE: activeName.value,
  };
  queryNoticeByUrl("/sys/messageRecord/app/recordReadMessage", portData).then(
    (res) => {
      queryNoticeData(activeName.value);
      openDetail(item);
    }
  );
};
function openDetail() {
  visibleDeatil.value = true;
}

function openSetting() {
  activeName.value = "1";
  queryNoticeData();
  noticeDrawer.value = true;
}
function clickCloseDrawer() {
  noticeDrawer.value = false;
}

function clicknNotice(item) {
  item.READSTATUS = 1;
  noticeDrawer.value = false;
  router.push(item.MENU);
}

function queryNoticeData() {
  noticeList.value = [];
  let URL = activeTabs.value.url;
  let data = {
    PAGENUM: 1,
    PAGESIZE: 20,
  };
  queryNoticeByUrl(URL, data).then((res) => {
    noticeList.value = res.RESULT.RECORDS;
  });
}

const handleClick = (tab) => {
  let index = tab.index * 1;
  noticeList.value = [];
  index = index == 0 ? 1 : 4;
  queryNoticeData(index);
};

const openMenu = () => {
  let path = activeTabs.value.path;
  if (systemName.value.includes("仓储")) {
    path = "/tms/TMS_implement/yjmxgl";
  }
  if (!path) return;
  clickCloseDrawer();
  router.push(path);
};

defineExpose({
  openSetting,
});
</script>

<style>
.el-dialog__body{
  padding: 10px 20px !important;
}
</style>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 8px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #eff1f4;
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: #eff1f4;
}
:deep(.el-drawer__body) {
  padding: 0 !important;
}
.notice-drawer {
  top: 50px !important;
  height: calc(100% - 50px) !important;
}

.notice-modal {
  background-color: transparent !important;
}



.notice-list {
  display: flex;
  font-size: 14px !important;
  // padding: 20px 10px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  cursor: pointer;

  .left {
    margin-right: 10px;
    width: 42px;

    .avt {
      width: 32px;
      height: 32px;
      line-height: 32px;
      border-radius: 32px;
      background-color: #fb7fb7;
      text-align: center;
      color: #fff;
      font-size: 12px;
    }
  }

  .right {
    flex: 1;

    .title {
      position: relative;

      .user-name {
        padding-right: 6px;
      }

      .vxe-icon-dot {
        position: absolute;
        right: 0;
        color: #ff7461;
        top: -12px;
        font-size: 16px;
      }
    }

    .content {
      padding: 10px 0;
      color: #aaa;
    }
  }

  &:hover {
    background-color: #fafafa;
  }
}
.closeDrawer {
  position: absolute;
  right: 20px;
  top: 26px;
  cursor: pointer;
  z-index: 99;
}

.notic {
  .titleImg {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  &-content {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    &:hover {
      background: var(--el-color-primary-light-9);
    }
    &-warntime {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.6);
      text-align: center;
      margin: 5px 0;
    }

    &-title {
      font-size: 14px;
      // font-weight: 500;
      color: #ff5c40;
      font-weight: bold;
      display: flex;
      align-items: center;

      .disflex {
        position: relative;
      }
    }
    .unread {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        background: #e83838ea;
        border-radius: 50%;
        right: 1px;
        top: 50%;
        z-index: 99;
        transform: translateY(-50%);
      }
    }

    &-name {
      color: #1c1c1c;
    }

    &-text {
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      padding: 0;
      margin: 10px 5px;
    }

    &-gird {
      display: grid;
      grid-template-columns: calc(15% - 20px) calc(85% - 20px);
      grid-column-gap: 20px;
      align-items: center;
    }

    &-startPos {
      width: 26px;
      height: 26px;
      background: #52b18c;
      border-radius: 6px;

      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
      line-height: 26px;
      text-align: center;
    }

    &-line {
      width: 2px;
      height: 27px;
      background: #b3b3b3;
      // border: 1px solid #B3B3B3;
      margin-left: 12px;
    }

    &-endPos {
      width: 26px;
      height: 26px;
      background: #e7927b;
      border-radius: 6px;

      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
      line-height: 26px;
      text-align: center;
    }

    &-textPos {
      font-size: 28px;
      font-weight: bold;
      color: #101010;
    }

    &-materialBlock {
      margin-top: 22px;
      padding: 16px;
      background: #f2f6fc;
      border-radius: 16px;
      font-size: 24px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.8);

      &-gird {
        display: grid;
        grid-template-columns: calc(25% - 10px) calc(75% - 10px);
        grid-column-gap: 10px;
      }
    }
  }

  .transverseLine {
    margin: 10px 0;
  }
}

.text-center {
  text-align: center;
  margin-bottom: 50px;
}
.html-wrap {
  :deep(img) {
    width: 100% !important;
  }
}
:deep(.el-tabs__content) {
  overflow: visible;
}
.notice {
  :deep(.el-badge__content.is-fixed) {
    left: -15px;
    z-index: 99;
  }
}
.all {
  padding: 5px;
  text-align: center;
  font-size: 14px;
  color: var(--el-color-primary);
  user-select: none;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
