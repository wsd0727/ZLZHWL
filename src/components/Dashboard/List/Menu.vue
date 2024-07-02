<template>
  <el-scrollbar :height="height">
    <div class="group-table">
      <div class="group-item" v-for="(item, index) in tableData" :key="index" @click="openMenu(item)">
        <i :class="['fa', item.VICON]" :style=" {'color': item.COLOR}"></i>
        <div class="title">{{ item.NAME }}</div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup name="">
import { getVchartData } from "#/dashboard/index";
const props = defineProps({
  height: Number,
  CFG: Object,
});

const allAlign = ref("left");
const tableData = ref([
  {
    NAME: "菜单",
    COLOR: "#FF0000",
    ICON: "",
    PATH:'/custom/customInner',
    ID: "ALLNUM",
    NUM: "600",
    VICON:'fa-camera',
  },
]);
const columnCFG = ref([]);

const teamList = ref([]);
const PK_CLASS = inject("PK_CLASS");

const router = useRouter();
function openMenu(data){
  router.push({ path: data.PATH });
}

try {
  let Arr = props.CFG.SLOTCFG ? JSON.parse(props.CFG.SLOTCFG) :[]
  tableData.value = Arr
} catch (error) {
  console.error('菜单未配置自定义数据：SLOTCFG');
}


</script>

<style scoped lang="scss">
.group-table {
  display: flex;
  flex-wrap: wrap;
  .group-item {
    width: 25%;
    margin: 20px 0;
    padding: 10px 20px;
    text-align: center;
    cursor: pointer;
    .title {
      color: #999;
      padding: 10px 0;
      font-size: 14px!important;
    }
    .value {
      padding: 10px 0;
      font-weight: 600;
    }
  }
}
</style>
