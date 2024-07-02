<template>
  <div class="dashboard-wrap">
    <div class="header bg-white pd5">
      <div class="project-title">
        <el-select v-model="keyword" filterable remote placeholder="Select" :remote-method="getProject">
          <el-option
            v-for="item in projectList"
            :key="item.VALUE"
            :label="item.LABEL"
            :value="item.VALUE"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <el-scrollbar :height="bodyHeight">
      <Dashboard :layout="layout" />
    </el-scrollbar>
  </div>
</template>

<script setup name="">
import { getCard2Dashboard, getProjectData , getCardQueryCFG } from "@/api/dashboard/index";
import Dashboard from "@/components/Dashboard";
import { provide } from "vue";

const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const layout = ref([]);
const bodyHeight = window.innerHeight - 170;
const card2Dashboard = ref([]);
// console.log(routerParams);

// 获取仪表下的卡片配置
const getCardList2Dash = () => {
  let query = { PK_PANEL: routerParams.VURL };
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
      };
      return newItem;
    });
    layout.value = newArr;
  });
};

// 获取仪表下的卡片 自定义条件
const getCardQueryConfig = () => {
  let query = { PK_PANEL: routerParams.VURL };
  getCardQueryCFG(query).then((res) => {
    console.log('getCardQueryCFG', res );
  });
};


// 

watch(layout , val => {
  console.log(444, val);
})

getCardList2Dash();
getCardQueryConfig();
// 获取项目列表
const keyword = ref('')
const activeDash = ref();
const projectList = ref([]);
function getProject(key) {
  if(!key && key != ''){
    return ;
  } 
  getProjectData({ KEYWORD: key }).then((res) => {
    projectList.value = res.RESULT;
    if(!key){
      keyword.value = projectList.value[0].VALUE
    }
  });
}
getProject('');


provide("PK_CLASS", keyword);
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
    .project-title {
      max-width: 40%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
