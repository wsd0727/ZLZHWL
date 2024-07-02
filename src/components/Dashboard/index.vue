<template>
  <grid-layout
    v-model:layout="props.layout"
    :col-num="12"
    :row-height="100"
    :is-draggable="false"
    :is-resizable="false"
    :is-mirrored="false"
    :vertical-compact="true"
    :margin="[10, 10]"
    :use-css-transforms="true"
  >
    <grid-item
      v-for="item in props.layout"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      :key="item.i"
      class="custom-grid"
    >
      <div class="title">
        <span>
          {{ item.VNAME }}
        </span>
      <span v-if="item.MOREROUTEURL" class="checkMore">
        <!-- 查看更多 -->
        <el-button type="primary" link @click="checkMore(item)" >查看更多</el-button>
      </span>

        <!-- <div class="right">
          <div class="more-btn" @click=" item.refresh++ " v-if=" item.refresh ">
            <el-icon class="Refresh" :size="18"><Refresh /></el-icon>
          </div>

          <el-dropdown>
            <span class="el-dropdown-link">
              <div class="more-btn" >
                <el-icon :size="16"><MoreFilled /></el-icon>
              </div>
            </span>
            <template #dropdown>
              <el-dropdown-menu style="width: 160px">
                <el-dropdown-item @click="setCard(item)" style="height: 32px"
                  >编辑</el-dropdown-item
                >
                <el-dropdown-item @click="deletCard(item)" style="height: 32px"
                  >删除</el-dropdown-item
                >
                <el-dropdown-item disabled style="height: 32px"
                  >复制</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div> -->
      </div>
      <component :is="dom[item.comp]" :height="item.h * 100 - 30" :CFG="item" />
    </grid-item>
  </grid-layout>
</template>

<script setup name="Dashboard">
//  在layout  中 w = 100 ， h = 100
import BarY from "@/components/Dashboard/Echarts/Bars/BarY.vue";
import BarX from "@/components/Dashboard/Echarts/Bars/BarX.vue";
import Line from "@/components/Dashboard/Echarts/Bars/BarX.vue";
import Pie from "@/components/Dashboard/Echarts/Bars/BarX.vue";
import TimeLine from "@/components/Dashboard/List/Timeline.vue";
import Team from "@/components/Dashboard/List/Team.vue";
import Document from "@/components/Dashboard/List/Document.vue";
import Table from "@/components/Dashboard/List/Table.vue";
import Group from "@/components/Dashboard/List/Group4.vue";
import Menu from "@/components/Dashboard/List/Menu.vue";
import Calendar from "@/components/Dashboard/List/Calendar.vue";
import Weekly from "@/components/Dashboard/List/Weekly.vue";
import ProjectGante from "@/components/Dashboard/List/ProjectGante.vue";
import RowNode from "@/components/Dashboard/List/RowNode.vue";



import ProjectView from "@/components/Dashboard/Echarts/Bars/ProjectView.vue";

const router = useRouter();


const dom = shallowReactive({
  BarY,
  BarX,
  Line,
  Pie,
  TimeLine,
  Team,
  Document,
  Table,
  Group,
  Menu,
  Calendar,
  ProjectView,
  Weekly,
  ProjectGante,
  RowNode
});

const props = defineProps({
  layout: Array,
});

const checkMore=(item) => {
  // router.push(item.MOREROUTEURL)
  router.push({
    path: item.MOREROUTEURL,
    query: { url: item.url },

  });
  
}


</script>

<style lang="scss" scoped>
.vue-grid-item {
  border: 1px solid #eee;
  background-color: #fff;
  border-radius: 4px;
}

.custom-grid {
  position: relative;
  padding: 10px;
  .title {
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .right{
      display: flex;
    }
    .more-btn {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 2px;
      &:hover {
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);
      }
    }
    .el-icon {
      transform: rotate(90deg);
      color: #aaa;
      cursor: pointer;
      position: relative;
      top: 4px;
    }
  }
  .example {
    width: 90%;
    height: 80%;
  }
}


</style>
