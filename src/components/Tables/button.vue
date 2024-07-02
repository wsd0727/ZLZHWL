<template>
  <template v-for="(itemBtn,indexBtn) in topButton" :key="itemBtn.BILLNO">
    <el-button :plain="indexBtn!=0" @click="handelEvent(itemBtn)" size="Default" :type="itemBtn.COLOR" :disabled="getButtonStatus(itemBtn)" :title="itemBtn.BTNTITLE " v-if="setShowBtn(itemBtn) " :loading="itemBtn.btnLoading" >
      {{ itemBtn.VNAME }}
    </el-button>

    <el-dropdown v-else-if="itemBtn.CHILDREN?.length" style="margin: 0 6px" @command="handelEvent" size="large">
      <el-button type="waring" size="default">
        {{ itemBtn.VNAME }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <template v-for="itemBtnS in itemBtn.CHILDREN" :key="itemBtnS.BILLNO">
            <el-dropdown-item :disabled="getButtonStatus(itemBtnS)" :command="itemBtnS" v-if=" setShowBtn(itemBtnS)">
              {{ itemBtnS.VNAME }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </template>
</template>

<script setup name="Button">
const props = defineProps({
  topButton: {
    type: Array,
  },
  currentData: {
    type: Array,
  },
  treeNode: {},
});

const { proxy } = getCurrentInstance();
const emit = defineEmits(["handelEvent"]);

const getButtonStatus = computed(() => (item) => {
  //计算属性传递参数
  let { ISCHOOSE: tnt, SCRNCONDITION: data } = item;
  data = data || "";
  //  tnt 指是否需要选择数据   data 按钮禁用条件
  let DATA = props.currentData.length ? props.currentData[0] : null,
    TREEDATA = props.treeNode || {},
    b = props.currentData.length == 1, // 只选中一条数据
    c = props.currentData.length > 0; // 选中了多条数据

  try {
    if (!data && (!tnt || tnt == 0)) {
      // 不需要选中数据的时候
      return false;
    } else if (tnt == 2 && c) {
      // 多选成立
      if (data && checkDataSetBtn(data)) {
        return true;
      }
      return false;
    } else if (tnt == 1) {
      // 单选成立时
      if (!b) return true;
      if (DATA && checkDataSetBtn(data)) {
        return true;
      }
      return false;
    } else if (data && !tnt) {
      return eval(data);
    } else {
      return true;
    }
  } catch (error) {
    return true
  }
});

// 按钮是多选按钮，对多条数据进行判断条件是否成立
function checkDataSetBtn(tj) {
  for (let i = 0, TNTlength = props.currentData.length; i < TNTlength; i++) {
    try {
      let DATA = props.currentData[i];
      if (eval(tj)) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

// 设置是否显示按钮

const setShowBtn = (btn) => {
  if (btn.ISSHOW == 0) return false;
  if (btn.ISSHOW == 2 && btn.OTHER) {
    if (!props.currentData.length) {
      return false;
    }
    try {
      for (var i = 0; i < props.currentData.length; i++) {
        let DATA = props.currentData[i];
        // console.error(evilFn( DATA, btn.OTHER));
        if (!evilFn(DATA, btn.OTHER)) {
          return false;
        }
      }
    } catch (error) {
      console.error(error);
    }

    return true;
  } else if (!btn.CHILDREN || !btn.CHILDREN.length) {
    return true;
  }
};

function handelEvent(data) {
  proxy.$emit("handelEvent", { data, row: null });
}

function evilFn(row, fn) {
  const DATA = JSON.parse(JSON.stringify(row)) || Object.create(null);
  let Fn = new Function("DATA", `return ${fn}`);
  const proxy = new Proxy(DATA, {
    has(target, key) {
      return true;
    },
  });
  return Fn(proxy);
}
</script>

<style scoped></style>
