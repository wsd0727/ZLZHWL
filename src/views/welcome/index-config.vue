<template>
  <div class="dashboard-wrap">
    <div class="header bg-white pd5" v-if="queryConfig.length">
      <!-- <div class="project-title" v-if="queryConfig.length">
        <el-select
          v-model="keyword"
          filterable
          remote
          placeholder="请选择"
          :remote-method="getProject"
        >
          <el-option
            v-for="item in projectList"
            :key="item.VALUE"
            :label="item.LABEL"
            :value="item.VALUE"
          >
          </el-option>
        </el-select>
      </div> -->

      <Form
        class="query-form"
        ref="formRefTop"
        v-model:formData="queryJson"
        :formConfig="set24col(queryConfig, 4)"
        :inline="true"
        @select="formSelect"
        @enter="enterEvent"
      />
      <div class="flex-row-end">
        <el-button @click="queryEvent" type="primary"> 查找 </el-button>
      </div>
    </div>

    <el-scrollbar :height="bodyHeight">
      <Dashboard :layout="layout" />
    </el-scrollbar>
  </div>
</template>

<script setup name="">
import {
  getCard2Dashboard,
  getProjectData,
  getCardIDByRole,
  getCardQueryCFG,
} from "@/api/dashboard/index";
import Dashboard from "@/components/Dashboard";
import { provide } from "vue";

import {
  getFormValue,
  deepClone,
  getShowCFG,
  random16,
  getUrlParams,
  evilFn,
  uuid,
} from "@/utils/index";

const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const layout = ref([]);
const bodyHeight = ref(null) 
const card2Dashboard = ref([]);
// console.log(routerParams);

const queryJson = ref({});
const queryConfig = ref([]);


const PK_PANEL =ref('') // 仪表id
// 获取角色下的仪表

const getCardID = ()=>{
  getCardIDByRole().then((res) => {
    card2Dashboard.value = res.RESULT;
    PK_PANEL.value = res.RESULT    
    if(res.RESULT ) getCardList2Dash();
  })
}

getCardID()

// 获取仪表下的卡片配置
const getCardList2Dash = () => {
  let query = { PK_PANEL: PK_PANEL.value };
  getCard2Dashboard(query).then((res) => {
    card2Dashboard.value = res.RESULT;
    let newArr = res.RESULT.map((i) => {
      let newItem = {
        x: i.CARD_COORD_X * 1,
        y: i.CARD_COORD_Y * 1,
        w: i.CARD_COORD_W * 1,
        h: i.CARD_COORD_H * 1,
        i: i.CARD_COORD_I * 1,
        refresh: i.IS_REFRESH * 1 || 0,
        comp: i.CARD_STYLE,
        url: i.DATA_INTERFACE_URL,
        BILLNO: i.BILLNO,
        SAMPLE_IMAGE: i.CARD_SAMPLE_IMAGE,
        VNAME: i.VNAME || i.CARD_NAME,
        SLOTCFG: i.SLOTCFG,
        MOREROUTEURL:i.MOREROUTEURL

      };
      return newItem;
    });
    layout.value = newArr;
    bodyHeight.value = window.innerHeight - 170;
    getCardQueryConfig();
  });
};

// 获取仪表下的卡片 自定义条件
const getCardQueryConfig = () => {
  let query = { PK_PANEL: PK_PANEL.value };
  getCardQueryCFG(query).then((res) => {
    let { SUBLIST } = res.RESULT , hasShow = SUBLIST.filter(i=> i.ISSHOW==1) ;
    if (SUBLIST.length && hasShow.length) {
      queryConfig.value = getShowCFG(SUBLIST);
      let initQueryJson = getFormValue(SUBLIST);
      queryJson.value = deepClone(initQueryJson);
      getDefaultPro()
    }else{
      bodyHeight.value = window.innerHeight - 100;
    }

    console.log(999, res );

    keyword.value = 1
  });
};

function getDefaultPro(initQueryJson) {
  let URL = "/user/default/info";
  axiosSave(URL, {}).then((newRes) => {
    let { PK_PROJECT, PROJECTNAME } = newRes.RESULT;
    let a = {
      LABEL: PROJECTNAME,
      VALUE: PK_PROJECT,
      BILLNO: PK_PROJECT,
      ...newRes.RESULT
    };
    queryJson.value.EnumData.PROJECTID.push(a)
    queryJson.value.PROJECTID = PROJECTNAME
  });
}


// 获取项目列表
const keyword = ref('');
const activeDash = ref();
const projectList = ref([]);
// function getProject(key) {
//   if (!key && key != "") {
//     return;
//   }
//   getProjectData({ KEYWORD: key }).then((res) => {
//     projectList.value = res.RESULT;
//     if (!key) {
//       keyword.value = projectList.value[0].VALUE;
//     }
//   });
// }

// 查询条件中的下拉触发查询
const formSelect = (res) => {
  if (res.query) {
    queryEvent();
  }
};
// 回车时触发查询功能
const enterEvent = () => {
  queryEvent();
};

const queryEvent=()=>{
  keyword.value =   keyword.value +1  ;
}

const btnLoading = ref(false);

function set24col(data, n) {
  let newdata = deepClone(data);
  let data2 = newdata.filter((i) => {
    i.COL = n == 24 ? n : i.COL || 4;
    return i.GROUPID == 1;
  });

  if (n != 24) {
    data2 = data2.slice(0, 6);
    let sumCol = 0,
      data3 = [];
    data2 = data2.forEach((i) => {
      sumCol += i.COL * 1;
      if (sumCol < 25) {
        data3.push(i);
      }
    });
    data2 = data3;
  } else {
    data2 = newdata;
  }
  return data2;
}

// provide("PK_CLASS", keyword );
provide("QueryJson", queryJson );

</script>

<style lang="scss" scoped>
.dashboard-wrap {
  .header {
    height: 60px;
    padding: 6px 10px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    justify-content:space-between;
    .query-form{
      width: 100% !important;
    }
    .project-title {
      max-width: 40%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

:deep(.el-form-item.el-form-item--small){
  margin-bottom: 0!important;
}
</style>
