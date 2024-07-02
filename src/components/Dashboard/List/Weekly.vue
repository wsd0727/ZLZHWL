<template>
  <div class="weekly-wrap">
    <div class="weekly-item" v-for="item in weeklyList" :key="item">
      <div class="title-wrap">
        <div class="title">
          {{ item.title }} 
        </div>
        <div class="action" :class="item.status == 1 ?'green':'blue'  " @click="item.status ==0 ?openWritWeekly(item.path):null">
          <el-icon v-if="item.status==1"><Select /></el-icon>
          <el-icon v-else><EditPen /></el-icon>
          {{ item.status == 1?'已提交':'去提交' }}
        </div>
      </div>

      <div class="content color-999">
        <div>王勇创建的统计</div>
        <p v-if="item.type==1">每天18:00-24:00提交</p>
        <p v-else>每周五18:00-周日24:0提交</p>
      </div>

      <div class="grid-wrap">
        <div class="grid-item" v-for="(itemV,indexV) in item.list" :key="indexV">
          <p class="grid-title">
            {{ itemV.value }}
          </p>
          <p class="grid-desc">
            {{ itemV.label }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";
const router = useRouter();


const props = defineProps({
  height: Number,
  CFG: Object,
});
const weeklyList = ref([
  {
    title: "日报",
    type: "1",
    path: "/coordination/DATREPORT",
    color:'green',
    status:'',
    list: [ {
        label: "按时提交",
        value: "180",
      }, {
        label: "迟交",
        value: "180",
      }, {
        label: "未提交",
        value: "180",
      },],
  },
  {
    title: "周报",
    type: "2",
    icon: "2",
    path: "/coordination/WORKREPORT",
    color:'blue',
    status:'',
    list: [],
  },
]);
const PK_CLASS = inject("PK_CLASS");
const QueryJson = inject("QueryJson");
function getData() {
  let query = {
    ...QueryJson.value,
    BEGINDATE: "",
    ENDDATE: "",
    YEAR: "",
  };
  getVchartData(props.CFG.url, query).then((res) => {
    let { daily , weekly ,dailyState, weeklyState } = res.RESULT
    console.log(5555, res );
    weeklyList.value[0].list = daily
    weeklyList.value[0].status = dailyState
    weeklyList.value[1].list = weekly
    weeklyList.value[1].status = weeklyState
  });
}


function openWritWeekly(path){
  router.push({ path: path });
}

getData();
// {
//         daily: [
//           {
//             label: "按时提交",
//             value: "180",
//           },
//         ],
//         weekly: [
//           {
//             label: "按时提交",
//             value: "180",
//           },
//         ],
//       }
</script>

<style lang="scss" scoped>
.weekly-wrap{
  display: flex;
  justify-content: space-between;
  .content{
    color: #999;
    font-size: 12px;
    margin-top: 20px;
  }
  .green{
    color: #67C23A;
  }
  .blue{
    color: #409eff;
  }
  .weekly-item{
    width: 45%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-top: 20px;
  }

  .title-wrap{
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }

  .grid-wrap{
    display: flex;
    justify-content: space-around;
    .grid-item{
      text-align: center;
    }
    .grid-title{
      font-size: 20px;
      font-weight: 600;
    }
    .grid-desc{
      color: #333;
      font-size: 12px;
    }
  }
 
}
</style>
