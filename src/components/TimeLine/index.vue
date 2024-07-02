<template>
  <el-scrollbar :height="height">
    <div class="timeline">
      <template v-if="data.length > 0">
        <div :class="['timeline-item',item[Key.STATUS] == '1'?'active':'']" v-for="(item,index) in data" :key="index">
          <div class="time">{{item[Key.TIME]}}</div>
          <div class="dot"></div>
          <div class="title">
            <TextOverflow :content="item[Key.TITLE]" />
          </div>
          <div class="desc">
            <TextOverflow :content="item[Key.DESC]" />
          </div>
          <div class="more" v-if="Key.MORE">
            <TextOverflow :content="item[Key.MORE]" />
          </div>
        </div>
      </template>
      <el-empty v-else class="nodata" :image-size="90" description="暂无数据" />
    </div>
  </el-scrollbar>
</template>

<script setup>
import TextOverflow from "@/components/TextOverflow"
const props = defineProps({
  data: Array,
  config: Array,
  height: {
    type: Number,
    default: 200
  }
})

const Key = ref({
  TIME: "",
  STATUS: "",
  TITLE: "",
  DESC: "",
  MORE: undefined
})

/** 转换 字段Key */
watch(() => props.config, val => {
  let { tableColumns } = val
  if (tableColumns.length == 0) return false
  tableColumns.forEach(el => {
    Key.value[el.REVERFIELD] = el.FIELD
  });
}, {
  immediate: true
})
</script>
<style lang="scss" scoped>
.timeline {
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
  // height: 180px;

  font-size: 16px;
  cursor: default;
  user-select: none;
  &-item {
    padding: 10px;
    box-sizing: border-box;
    flex-shrink: 0;
    width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &.active {
      .dot {
        background: var(--el-color-primary);
        &::after {
          background: var(--el-color-primary);
        }
      }
    }
    &:last-child {
      .dot::after {
        display: none;
      }
    }
    .time,
    .title,
    .desc,
    .more {
      height: 20px;
      line-height: 20px;
      margin: 5px 0;
      overflow: hidden;
      width: 100%;
      text-align: center;
    }
    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--el-color-info-light-8);
      position: relative;
      &::after {
        content: "";
        width: 180px;
        height: 2px;
        background: var(--el-color-info-light-8);
        position: absolute;
        top: 50%;
        left: 16px;
      }
    }
    .title {
      color: #000;
    }
    .desc,
    .more {
      width: 80%;
      font-size: 14px;
      color: #999;
    }
  }
  .nodata {
    flex-shrink: 0;
    width: 100%;
  }
}
</style>