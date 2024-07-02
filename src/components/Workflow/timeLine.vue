<template>
  <el-timeline class="work work-timeline">
    <template v-if="workDoList.length">
      <el-timeline-item v-for="item in workDoList" :key="item.ACTIVITYID" :icon="item.icon" :type="item.STATUS == '2'?'danger':workEndKeyList.includes(item.ACTIVITYID)?'success':item.STATUS == '0'?'info':'warning'" :color="item.color" size="large" :timestamp="item.timestamp">
        <div class="work-timeline-item">
          <div class="title">
            <span class="dot">{{ (item.ACTIVITYID && item.ACTIVITYID.includes("end_"))?'办结':item.NAME }}</span>
            <span class="user">{{ item.ASSIGNEENAME}}</span>
            <span class="time">{{item.ENDTIME}}</span>
          </div>
          <div class="work-content" v-if="item.optionVO?.comments">{{item?.optionVO?.comments}}</div>
        </div>
      </el-timeline-item>
    </template>
    <el-empty v-else />
  </el-timeline>
</template>
<script>
export default {
  inheritAttrs: false,
}
</script>
<script setup name="WorkflowTimeLine">
const props = defineProps({
  data: Object // 审批流节点数据
})
const emit = defineEmits(['refresh'])
const getData = () => emit('refresh')
const workDoList = ref([])
const workEndKeyList = ref([])
const mapdata = () => {
  if (!props.data) return
  let { DETAILVOLIST, ENDLIST, NOTAKELIST } = props.data,
    end = [], wait = [], ing = [];
  for (const key in DETAILVOLIST) {
    if (key == 'startEventNode') continue;
    if (ENDLIST.includes(key)) {
      end.push(DETAILVOLIST[key][0])
    } else {
      ing.push(DETAILVOLIST[key][0])
    }
  }
  for (const key in NOTAKELIST) {
    if (Array.isArray(NOTAKELIST[key])) {
      wait = [...wait, ...NOTAKELIST[key]]
    } else {
      wait.push(NOTAKELIST[key])
    }
  }
  workEndKeyList.value = ENDLIST
  workDoList.value = [...end, ...ing, ...wait]
}
watch(() => props.data, () => {
  mapdata()
}, {
  immediate: true
})
defineExpose({ type: "WorkflowTimeLine", getData });
</script>

<style lang="scss" scoped>
:deep(.el-timeline-item) {
  padding-bottom: 10px;
  &:last-child {
    padding: 0;
  }
}
.work {
  &-timeline {
    &-item {
      font-size: var(--el-font-size-base);
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
      }
    }
    .dot::after {
      content: ":";
      margin-right: 5px;
    }
    .user {
      font-weight: bold;
      margin-right: 20px;
    }
    .time {
      color: var(--el-text-color-regular);
    }
  }
  &-content {
    width: 90%;
    margin: 0;
    border: 1px solid #ccc;
    padding: 6px;
    border-radius: 4px;
    background: #f9f9f9;
  }
}
</style>