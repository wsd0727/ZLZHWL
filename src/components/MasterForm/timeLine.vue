<template>
  <div class="form-timeline" v-if="dataList.length > 0">
    <div class="title">操作记录
      <el-icon class="icon" @click="reverData">
        <SortDown v-if="!reversed" />
        <SortUp v-else />
      </el-icon>
    </div>
    <ol class="form-timeline-box" :reversed="reversed">
      <li class="form-timeline-item" v-for="item in dataList" :key="item.BILLNO">
        <span class="time">{{item.CREATIONTIME}}</span>由<span class="user">{{item.OPERATER}}</span>{{item.OPERATEDESC}}。
      </li>
    </ol>
  </div>
</template>

<script setup name="formTimeLine">
import { BillsHistory } from "#/form"
const props = defineProps({
  data: Object,
})
const reversed = ref(false)
const dataList = ref([])

const reverData = () => {
  reversed.value = !reversed.value
  dataList.value = dataList.value.reverse()
}

const getData = () => {
  let { MODULE, PAGE, tableBillNo } = props.data
  BillsHistory({
    MODULEID: MODULE,
    PAGEID: PAGE,
    BILLNO: tableBillNo
  }).then(res => {
    dataList.value = res.RESULT
  })
}

// getData()
</script>

<style lang="scss" scoped>
.form-timeline {
  padding: 20px 10px;
  .title {
    padding: 10px;
    border-bottom: 1px solid var(--el-border-color);
    display: flex;
    align-items: center;
    .icon {
      margin-left: 5px;
    }
  }
  &-item {
    font-size: var(--el-font-size-base);
    color: #3b3b3b;
    .time {
      margin-right: 10px;
      &::after {
        content: ",";
      }
    }
    .user {
      font-weight: bold;
      margin: 0 5px;
    }
  }
}
</style>