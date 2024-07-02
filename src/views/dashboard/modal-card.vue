<template>
  <vxe-modal
    destroy-on-close
    v-model="props.visible"
    width="60%"
    height="60%"
    id="workModal"
    resize
    storage
    transfer
    title="XX"
    className="custom-modal"
    :showHeader="false"
    @close="closeModal"
  >
    <template #default>
      <div class="custom-body">
        <div class="left">
          <div>
            <div class="title">添加卡片</div>
            <el-input v-model="keyword" class="keyword"></el-input>
          </div>
          <div
            v-for="item in treeData"
            :key="item.VALUE"
            :class="[
              'type-item',
              activeType?.VALUE == item.VALUE ? 'active' : '',
            ]"
            @click="handelTree(item)"
          >
            <el-icon :size="15" :color="color">
              <Edit />
            </el-icon>
            {{ item?.LABEL }} * {{ item?.CHILDRENNUM }}
          </div>
        </div>
        <div class="right">
          <div class="top">
            <div>
              {{ activeType.LABEL }}
            </div>
            <el-icon @click="closeModal" :size="20"><Close /></el-icon>
          </div>
          <div class="center">
            <el-scrollbar :height="400">
              <div class="content">
                <div
                  v-for="item in cardData"
                  :key="item.BILLNO"
                  :class="[
                    'card-item',
                    activeCard == item.BILLNO ? 'active' : '',
                  ]"
                  @click="handelCard(item)"
                >
                  <img
                    src="https://cdn-aliyun.pingcode.com/static/portal/assets/widget-icons/product-list.svg?v=4.108.0"
                    alt=""
                    srcset=""
                  />
                  <div class="card-title">
                    <div class="name">
                      {{ item.VNAME }}
                    </div>
                    <p class="desc">
                      {{ item.CARD_DESC }}
                    </p>
                  </div>
                  <el-icon :size="16" color="" v-if="activeCard == item.BILLNO"
                    ><CircleCheckFilled
                  /></el-icon>
                </div>
              </div>
            </el-scrollbar>
          </div>

          <div class="footer">
            <el-button link> 取消 </el-button>
            <el-button @click="submit"> 确定 </el-button>
          </div>
        </div>
      </div>
    </template>
  </vxe-modal>
</template>

<script setup name="">
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
  CircleCheckFilled,
} from "@element-plus/icons-vue";
import { getCardType, getCardList } from "@/api/dashboard/index";

const { proxy } = getCurrentInstance();

const props = defineProps({
  visible: Boolean,
  treeData: Array,
});

const cardData = ref([]);
const keyword = ref("");
const activeType = ref(null);
const activeCard = ref("");
const chooseCard = ref({});

const closeModal = () => {
  proxy.$emit("closeModal");
};

const getCardData = (init) => {
  // console.log(789, props.treeData);
  if (init == 1) activeType.value = props.treeData[0];
  let query = { cardType: activeType.value?.VALUE };
  getCardList(query).then((res) => {
    cardData.value = res.RESULT;
  });
};

const handelTree = (item) => {
  activeType.value = item;
  getCardData();
};

const handelCard = (item) => {
  activeCard.value = item.BILLNO;
  chooseCard.value = item;
};

const submit = () => {
  proxy.$emit("saveCard", chooseCard.value);
};

// 主动暴露方法
defineExpose({ getCardData });
</script>

<style lang="scss">
.custom-modal {
  .vxe-modal--content {
    padding: 0 !important;
  }
}
</style>

<style scoped lang="scss">
.custom-body {
  display: flex;
  height: 100%;
  .left {
    width: 260px;
    height: 100%;
    padding: 0 10px;
    flex-shrink: 0;
    background-color: #fbfbfb;
    border-right: 1px solid #eee;
    .keyword {
      margin-bottom: 10px;
    }
    .title {
      margin: 15px;
      font-size: 16px;
      color: #333;
    }
    .type-item {
      height: 36px;
      line-height: 36px;
      border-radius: 4px;
      padding: 0 10px;
      margin-bottom: 8px;
      cursor: pointer;
      &:hover {
        background-color: #f5f5f5;
      }
      .el-icon {
        position: relative;
        top: 3px;
      }
    }
    .active {
      color: var(--el-color-primary);
      // background-color: #eff4ff;
      background-color: var(--el-color-primary-light-9);
    }
  }

  .right {
    margin: 15px;
    flex-grow: 1;
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .el-icon {
        cursor: pointer;
      }
      .el-icon:hover {
        color: var(--el-color-primary);
        background-color: #eff4ff;
      }
    }
    .content {
      padding-right: 10px;
      .card-item {
        margin-bottom: 8px;
        margin-right: 0;
        padding: 18px 20px;
        height: 123px;
        display: flex;
        border-radius: 2px;
        box-shadow: 0 2px 8px #00000012;
        border: 1px solid #eee;
        position: relative;
        img {
          vertical-align: middle;
          margin-right: 20px;
        }
        &:hover {
          border-color: var(--el-color-primary);
        }
        .el-icon {
          position: absolute;
          top: 10px;
          right: 10px;
        }

        .card-title {
          .name {
            font-size: 16px;
          }
          .desc {
            color: #999;
          }
        }
      }
      .active {
        background-color: var(--el-color-primary-light-9);
        .el-icon {
          color: var(--el-color-primary);
        }
      }
    }

    .footer {
      text-align: right;
    }
  }
}
</style>
