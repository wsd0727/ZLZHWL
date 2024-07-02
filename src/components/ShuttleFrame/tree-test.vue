<template>
  <div>
    <div class="v-transfer">
      <!-- 左侧框 -->
      <div class="v-transfer-item v-transfer-left">
        <div class="header">
          <el-checkbox v-model="checkedLeft" :disabled="leftTreeData.length < 1" label="" size="large" style="margin-right: 12px" @change="leftAllCheck" />
          {{ leftTitle }}
        </div>
        <div class="content">
          <!-- 搜索框 -->
          <div class="seacrh-box">
            <el-input v-model.trem="leftFilterText" placeholder="请输入" clearable @clear="onSearchLeft" @keyup.enter="onSearchLeft" @change="onSearchLeft"></el-input>
          </div>
          <!-- 数据区域 -->
          <div class="tree-box">
            <div class="empty-box" v-if="leftTreeData.length < 1">暂无数据</div>
            <el-tree class="tree" v-else ref="leftTreeRef" :data="leftTreeData" show-checkbox :node-key="'id'" :filter-node-method="filterNode" :props="props.defaultProps" @check="onCheckLeft">
              <template #default="{ data }">
                <span style="padding-left: 4px; font-size: 16px">{{ data.title }}</span>
              </template></el-tree>
          </div>
        </div>
      </div>
      <!-- 按钮区域 -->
      <div class="v-transfer-middle">
        <div class="middle-icon">
          <div :disabled="leftOperation.length < 1" @click="addHandle">
            <ArrowRight style="width: 1em; height: 1em" />
          </div>
          <div :disabled="rightOperation.length < 1" @click="delHandle">
            <ArrowLeft style="width: 1em; height: 1em" />
          </div>
        </div>
      </div>
      <!-- 右侧框 -->
      <div class="v-transfer-item v-transfer-right">
        <div class="header">
          <el-checkbox v-model="checkedRight" :disabled="rightTreeData.length < 1" label="" size="large" style="margin-right: 12px" @change="rightAllCheck" />{{ rightTitle }}
        </div>
        <div class="content">
          <!-- 搜索框 -->
          <div class="seacrh-box">
            <el-input v-model.trem="rightFilterText" placeholder="请输入" clearable @clear="onSearchRight" @keyup.enter="onSearchRight" @change="onSearchRight"></el-input>
          </div>
          <!-- 数据区域 -->
          <div class="tree-box">
            <div class="empty-box" v-if="rightTreeData.length < 1">暂无数据</div>
            <el-tree class="tree" v-else ref="rightTreeRef" :filter-node-method="filterNode" :data="rightTreeData" show-checkbox :node-key="'id'" :props="props.defaultProps" @check="onCheckRight">
              <template #default="{ data }">
                <span style="padding-left: 4px; font-size: 16px">{{ data.title }}</span>
              </template>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomBtn">
      <el-button type="primary" style="background-color:#0068DA;" @click="roleDialogSubmit">确认授权</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="TreeTransfer">
// https://blog.csdn.net/xuexi0754/article/details/134932140
import { onMounted, ref, reactive, watch, nextTick } from "vue";
import { ElTree, ElMessage, ElMessageBox } from "element-plus";
import { grant } from "@/api/roleMangement/index";
import type Node from "element-plus/es/components/tree/src/model/node";
import lodash from "lodash";
import { TreeNodeData } from "element-plus/es/components/tree/src/tree.type";
import { Right } from "@element-plus/icons-vue";
import { treeToList } from "@/utils/util";
interface treeNode {
  className: string;
  parentId: string;
  id: string;
  children?: treeNode;
}

const props = defineProps({
  leftTitle: {
    type: String,
    default: () => {
      return "";
    },
  },
  rightTitle: {
    type: String,
    default: () => {
      return "";
    },
  },
  leftTree: {
    type: Array,
    default: () => {
      return [];
    },
  },
  rightTree: {
    type: Array,
    default: () => {
      return [];
    },
  },
  defaultProps: {
    type: Object,
    default: () => {
      return {
        children: "children",
        label: "title",
      };
    },
  },
  nodeKey: {
    type: String,
    default: "id",
  },
  leafsArr: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const checkedLeft = ref(false);
const checkedRight = ref(false);

// 抛出事件
const emits = defineEmits(["change", "delete", "add"]);

const leftFilterText = ref<string>("");
const leftTreeData = ref<any[]>([]);
const leftDefaultCheckedKeys = ref<any[]>([]);
const leftDefaultExpandedKeys = ref<any[]>([]);
const leftOperation = ref<any[]>([]);
const leftTreeRef = ref<InstanceType<typeof ElTree>>();

const rightFilterText = ref<string>("");
const rightTreeData = ref<any[]>([]);
const rightDefaultCheckedKeys = ref<any[]>([]);
const rightDefaultExpandedKeys = ref<any[]>([]);
const rightOperation = ref<any[]>([]);
const rightTreeRef = ref<InstanceType<typeof ElTree>>();
const removeNodes = ref<any[]>([]);
interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}

watch(
  props,
  (newVal) => {
    leftTreeData.value = lodash.cloneDeep(newVal.leftTree);
    rightTreeData.value = lodash.cloneDeep(newVal.rightTree);
  },
  { immediate: true }
);
watch(rightFilterText, (val) => {
  rightTreeRef.value!.filter(val);
});
watch(leftFilterText, (val) => {
  leftTreeRef.value!.filter(val);
});
defineExpose({
  leftTreeData,
  rightTreeData,
});

onMounted(() => {
  leftFilterText.value = "";
  rightFilterText.value = "";
});

const formatTree = (
  tree: any[],
  parentKey: string = "parentId",
  idKey: string = "id"
) => {
  // 格式化选择的树：清除全选下面的子节点
  let swap,
    parentIds: string[] = [];
  // 先找出有children的id集合，再把所有的数据做对比，只要parentId和其中一个对上，就把该数据删除；
  tree.forEach((item, index) => {
    if (item.children) {
      parentIds.push(item[idKey]);
    }
  });
  swap = tree.filter((item, index) => {
    if (parentIds.indexOf(item[parentKey]) == -1) {
      return item;
    }
  });
  return swap;
};

// 左侧选中
const onCheckLeft = () => {
  leftOperation.value = formatTree(
    leftTreeRef.value!.getCheckedNodes(false) || [],
    "parentId",
    "id"
  );
};
// 左侧搜素
// const onSearchLeft = () => {
//   leftTreeRef.value!.filter(leftFilterText.value)
// }
// 左侧过滤
// const filterLeftNode = (value: string, data: Tree, node: treeNode) => {
//   if (!value) return true
//   return chodeNode(value, data, node)
// }

// 右侧选中
const onCheckRight = () => {
  rightOperation.value = formatTree(
    rightTreeRef.value!.getCheckedNodes(false) || [],
    "parentId",
    "id"
  );
};
// 右侧搜素
const onSearchRight = () => {
  rightTreeRef.value!.filter(rightFilterText.value);
};
// 左
const onSearchLeft = () => {
  leftTreeRef.value!.filter(leftFilterText.value);
};
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.includes(value);
};

const leftAllCheck = () => {
  const leftTree = leftTreeRef.value;
  if (checkedLeft.value) {
    leftTree?.setCheckedNodes(leftTreeData.value);
    checkedLeft.value = true;
  } else {
    leftTree?.setCheckedNodes([]);
    checkedLeft.value = false;
  }
};
const rightAllCheck = () => {
  const rightTree = rightTreeRef.value;
  if (checkedRight.value) {
    rightTree?.setCheckedNodes(rightTreeData.value);
    checkedRight.value = true;
  } else {
    rightTree?.setCheckedNodes([]);
    checkedRight.value = false;
  }
};
const removeChecked = (rightList, allCheckedKeys) => {
  rightList.forEach((e, index) => {
    if (allCheckedKeys.indexOf(e.id) == -1) {
      rightList.splice(index, 1);
    }
    if (e.children) {
      removeChecked(e.children, allCheckedKeys);
    }
  });
  return rightList;
};

const recursionTree = (parents, allCheckedKeys) => {
  parents.forEach((e) => {
    const list = lodash.filter(
      e.children,
      (child) => allCheckedKeys.indexOf(child.id) >= 0
    );
    e.children = list;
    if (e.children.length !== 0) {
      recursionTree(e.children, allCheckedKeys);
    }
  });
  return parents;
};

// 右移
const addHandle = async () => {
  const leftTree = leftTreeRef.value;
  checkedLeft.value = false;
  if (!leftTree) {
    return;
  }
  const leftNodes = leftTree.getCheckedNodes(false, true);
  const parents = leftNodes.filter(
    (el) => el.children && el.children.length > 0 && el.parentId == "0"
  );
  const checkedKeys = leftTree.getCheckedKeys(false);
  const halfCheckedKeys = leftTree.getHalfCheckedKeys();
  const allCheckedKeys = halfCheckedKeys.concat(checkedKeys);
  const rightTree = rightTreeRef.value;
  if (!rightTree) {
    let rightList = parents.map((parent) => {
      const obj = lodash.omit(parent, ["children"]);
      obj.children = lodash.filter(
        parent.children,
        (child) => allCheckedKeys.indexOf(child.id) >= 0
      );
      return obj;
    });

    let copyRightList = lodash.cloneDeep(rightList);
    removeChecked(copyRightList, allCheckedKeys);
    rightTreeData.value.push(...copyRightList);
  } else {
    let isExist = false;
    rightTree.data.forEach((e) => {
      if (parents[0].id === (e as any).id) isExist = true;
    });
    if (!isExist) {
      const overall = lodash.cloneDeep(parents);
      let rightList = await recursionTree(overall, allCheckedKeys);
      let copyRightList = lodash.cloneDeep(rightList);
      removeChecked(copyRightList, allCheckedKeys);
      rightTreeData.value.push(...copyRightList);
    } else {
      handleData(leftNodes, rightTree, allCheckedKeys);
    }
  }
  // 移过去之后要删除原本的值
  leftNodes.forEach((node) => {
    leftTree.setChecked(node, false, false);
    if (checkedKeys.indexOf(node.id) >= 0) {
      leftTree.remove(node);
    }
  });

  leftOperation.value = formatTree(
    leftTree.getCheckedNodes(false) || [],
    "parentId",
    "id"
  );
  emits("change", leftTreeData.value, rightTreeData.value);
  emits("add");
};

// 左移
const delHandle = async () => {
  checkedRight.value = false;
  const rightTree = rightTreeRef.value;
  if (!rightTree) {
    return;
  }
  const rightNodes = rightTree.getCheckedNodes(false, true);
  const checkedKeys = rightTree.getCheckedKeys(false);
  const halfCheckedKeys = rightTree.getHalfCheckedKeys();
  const allCheckedKeys = halfCheckedKeys.concat(checkedKeys);

  const parents = lodash.filter(
    rightNodes,
    (item) => item.children && item.children.length > 0 && item.parentId == "0"
  );
  const leftTree = leftTreeRef.value;
  if (!leftTree) {
    let leftList = parents.map((parent) => {
      const obj = lodash.omit(parent, ["children"]);
      obj.children = lodash.filter(
        parent.children,
        (child) => allCheckedKeys.indexOf(child.id) >= 0
      );
      return obj;
    });
    let copyLeftList = lodash.cloneDeep(leftList);
    removeChecked(copyLeftList, allCheckedKeys);
    leftTreeData.value.push(...copyLeftList);
  } else {
    let isExist = false;
    leftTree.data.forEach((e) => {
      if (parents[0].id === (e as any).id) isExist = true;
    });
    if (!isExist) {
      const overall = lodash.cloneDeep(parents);
      let leftList = await recursionTree(overall, allCheckedKeys);
      let copyLeftList = lodash.cloneDeep(leftList);
      removeChecked(copyLeftList, allCheckedKeys);
      rightTreeData.value.push(...copyLeftList);
    } else {
      handleData(rightNodes, leftTree, allCheckedKeys);
    }
  }

  rightNodes.forEach((node) => {
    rightTree.setChecked(node, false, false);
    if (checkedKeys.indexOf(node.id) >= 0) {
      rightTree.remove(node);
    }
  });

  rightOperation.value = formatTree(
    rightTree.getCheckedNodes(false) || [],
    "parentId",
    "id"
  );

  emits("change", leftTreeData.value, rightTreeData.value);

  emits("delete");
};
const handleData = (rightNodes, leftTree, allCheckedKeys) => {
  rightNodes.forEach((item) => {
    if (item.children) {
      let parent = leftTree.getNode(item.parentId);
      let node = item;
      if (!leftTree.getNode(item.id) && allCheckedKeys.indexOf(item.id) > 0) {
        const copyNode = lodash.cloneDeep(node);
        copyNode.children = [];
        leftTree.append(copyNode, parent);
      }
      handleData(item.children, leftTree, allCheckedKeys);
    } else {
      let parent = leftTree.getNode(item.parentId);
      let node = item;
      if (!leftTree.getNode(item.id) && allCheckedKeys.indexOf(item.id) > 0) {
        leftTree.append(node, parent);
      }
    }
  });
};

const roleDialogSubmit = () => {
  const rightList = treeToList(rightTreeData.value);
  grant({
    roleIds: [props.nodeKey],
    menuIds: rightList.map((item) => item.id),
  }).then((res) => {
    ElMessage({
      type: "success",
      message: "授权成功!",
    });
  });
};
</script>