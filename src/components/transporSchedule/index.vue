<template>
  <div class="transporSchedule">
    <el-card
      class="box-card"
      v-for="item in list"
      :key="item.BILLNO"
      style="width: 100%; margin-right: 6px;"
      :style="{ height: `${props.height}px` }"
    >
      <!-- <div class="text-r mb10">
        <el-button @click="clickCheck(item)" type="primary" link >查看</el-button>
      </div> -->

      <div class="transporSchedule-alone text-c cp" @dblclick="clickCheck(item)">
        <div class="transporSchedule-position text-ellipsis-3">{{ item.SENDADDRESS }}</div>
        <div class="w100 text-c">
          <!-- <div class="mb10 transporSchedule-progressText">
            {{ item.PROGRESSNAME }} {{ item.PROGRESSVALUE }}%
          </div> -->
          <el-progress
            :percentage="item.PROGRESSVALUE" 
            :text-inside="true"
            :stroke-width="24"
            color="#5a9cf8"
          >
            <span style="color:#000">{{ item.PROGRESSNAME }} {{ item.PROGRESSVALUE }}%</span>
          </el-progress>
        </div>
        <div class="transporSchedule-position text-ellipsis-3">{{ item.RECEIVEADDRESS }}</div>
      </div>
    </el-card>

    <vxe-modal
      destroy-on-close
      v-model="tableModal"
      width="60%"
      height="60%"
      id="tableModal"
      title="查看"
      resize
      storage
      transfer
      show-zoom
      show-footer
      @close="closeModal"
    >
      <Modal
        :MODULE="MODULEModal"
        :PAGE="PAGEModal"
        :tableBillNo="tableBillNo"
      />
    </vxe-modal>
  </div>
</template>
  
  <script setup>
import { onMounted } from "vue";
import Modal from "@/views/table/modal";

const props = defineProps({
  data: Array,
  buttonList: Array,
  totalData: Array,
  height: {
    type: String,
    default: 180,
  },
});

const list = ref([]);
const carCheck = ref([]);
const trainCheck = ref([]);
const shipCheck = ref([]);
const tableModal = ref(false);
const MODULEModal = ref("");
const PAGEModal = ref("");
const tableBillNo = ref("");

onMounted(() => {
  carCheck.value = props.buttonList.filter((ele) => ele.ACTION == "carCheck");
  trainCheck.value = props.buttonList.filter(
    (ele) => ele.ACTION == "trainCheck"
  );
  shipCheck.value = props.buttonList.filter((ele) => ele.ACTION == "shipCheck");
});

watch(
  () => props.data,
  (val) => {
    list.value = val;
    // || props.totalData[0]
  },
  {
    immediate: true,
  }
);

const clickCheck = (item) => {
  let val = [];
  if (item.PROGRESSNAME.includes("汽")) {
    val = carCheck.value[0].OTHER.split(",");
  } else if (item.PROGRESSNAME.includes("铁")) {
    val = trainCheck.value[0].OTHER.split(",");
  } else if (item.PROGRESSNAME.includes("船")) {
    val = shipCheck.value[0].OTHER.split(",");
  }
  MODULEModal.value = val[0];
  PAGEModal.value = val[1];
  tableBillNo.value = item.BILLNO;

  tableModal.value = true;
};
</script>
  <style lang="scss" scoped>
.transporSchedule {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // height: 100%;
  :deep(.el-card__body){
    height: 100%;
  }
  &-alone {
    height: 100%;
    //     display: flex;
    // justify-content: space-between;
    align-items: center;
    // align-items: end;

    display: grid;
    grid-template-columns: calc(20% - 10px) calc(60% - 10px) calc(20% - 10px);
    grid-column-gap: 10px;
  }
  &-position {
    font-size: 14px;
    font-weight: 500;
    color: #000;
  }
  &-progressText {
    font-size: 16px;
    font-weight: 500;
    color: #1964f8;
  }
}
.box-card:last-child{
  margin: 0 !important;
}
</style>