<template>
  <div class="transfer">
    <div class="transfer-item transfer-left" v-if="!detail">
      <div class="header">
        <el-checkbox v-model="checkedLeft" :disabled="LeftTreeData.length < 1" label="" style="margin-right: 12px" @change="LeftAllCheck" />
        {{ leftTitle }}
      </div>
      <div class="content">
        <div class="search">
          <el-input v-model.trim="searchLeft" placeholder="请输入内容" :prefix-icon="Search" clearable @clear="onSearchLeft" @keyup.enter="onSearchLeft" @change="onSearchLeft" />
        </div>
        <div class="tree-box">
          <el-scrollbar>
            <el-tree class="tree" ref="LeftTreeRef" :data="LeftTreeData" node-key="VALUE" :filter-node-method="filterNode" :check-strictly="strictly" :indent="14" :props="TreeProps" show-checkbox @check="onCheckLeft"></el-tree>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="transfer-item transfer-btn" v-if="!detail">
      <el-button type="primary" :disabled="leftOperation.length < 1" @click="addHandle">
        <ArrowRight style="width: 1em; height: 1em" />
      </el-button>
      <el-button type="primary" :disabled="rightOperation.length < 1" @click="delHandle">
        <ArrowLeft style="width: 1em; height: 1em" />
      </el-button>
    </div>
    <div class="transfer-item transfer-right">
      <div class="header">
        <el-checkbox v-if="!detail" v-model="checkedRight" :disabled="RightTreeData.length < 1" label="" style="margin-right: 12px" @change="RightAllCheck" />
        {{ rightTitle }}
      </div>
      <div class="content">
        <div class="search" v-if="!detail">
          <el-input v-model="searchRight" placeholder="请输入内容" :prefix-icon="Search" clearable @clear="onSearchRight" @keyup.enter="onSearchRight" @change="onSearchRight" />
        </div>
        <div class="tree-box">
          <el-scrollbar>
            <el-tree class="tree" ref="RightTreeRef" :data="RightTreeData" node-key="VALUE" :filter-node-method="filterNode" :indent="14" :props="TreeProps" show-checkbox @check="onCheckRight"></el-tree>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 穿梭树 组件
 * @author WangJun
 * @date 2024-03-22
 * @param {Object} modelValue 绑定值
 * @param {Object} config 配置项
 * @param {Boolean} detail 是否为详情
 */
import { Search, ArrowRight, ArrowLeft } from '@element-plus/icons-vue'
import lodash from 'lodash-es'

const props = defineProps({
  modelValue: Object,
  config: Object,
  detail: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:modelValue'])
const { proxy } = getCurrentInstance();

// 配置
/**
 *  SLOTCFG: {
 *    Height: '300px', // 高度
 *    Width: '30%', // 宽度
 *    LeftTitle: '列表', // 左侧标题  
 *    RightTitle: '已选择' // 右侧标题
 *    Strictly: false // 是否严格模式
 *  }
 */
const SLOTCFG = computed(() => {
  try {
    return JSON.parse(props.config.SLOTCFG)
  } catch (err) {
    console.error("穿梭树:插槽配置项错误", err);
    return {}
  }
})
const hConfig = computed(() => SLOTCFG.value?.Height || '300px')
const wItemConfig = computed(() => SLOTCFG.value?.Width || '30%')
const leftTitle = computed(() => SLOTCFG.value?.LeftTitle || "全部")
const rightTitle = computed(() => SLOTCFG.value?.RightTitle || "已选择")
const strictly = computed(() => SLOTCFG.value?.Strictly == 'true' || false)

const TreeProps = {
  label: 'LABEL',
  children: 'CHILDREN'
}

const LeftTreeRef = ref()
const RightTreeRef = ref()

// 全选功能
const checkedLeft = ref(false)
const checkedRight = ref(false)
const LeftAllCheck = (val) => {
  const leftTree = LeftTreeRef.value;
  if (checkedLeft.value) {
    leftTree?.setCheckedNodes(LeftTreeData.value);
    checkedLeft.value = true;
  } else {
    leftTree?.setCheckedNodes([]);
    checkedLeft.value = false;
  }
}
const RightAllCheck = (val) => {
  const rightTree = RightTreeRef.value;
  if (checkedRight.value) {
    rightTree?.setCheckedNodes(RightTreeData.value);
    checkedRight.value = true;
  } else {
    rightTree?.setCheckedNodes([]);
    checkedRight.value = false;
  }
}

// 查询功能
const searchLeft = ref('')
const searchRight = ref('')
const onSearchLeft = () => {
  LeftTreeRef.value?.filter(searchLeft.value);
}
const onSearchRight = () => {
  RightTreeRef.value?.filter(searchRight.value);
}
const filterNode = (value, data) => {
  if (!value) return true;
  return data.LABEL.includes(value);
};

// 按钮操作
const leftOperation = ref([])
const rightOperation = ref([])
const addHandle = async () => {
  const leftTree = LeftTreeRef.value
  checkedLeft.value = false
  if (!leftTree) return
  const leftNodes = leftTree.getCheckedNodes(false, true)
  let parents = leftNodes.filter(el => el.CHILDREN && el.CHILDREN.length > 0 && el.PK_PARENT == '0')
  const checkedKeys = leftTree.getCheckedKeys(false)
  let halfCheckedKeys = leftTree.getHalfCheckedKeys()
  let allCheckedKeys = halfCheckedKeys.concat(checkedKeys)
  if (strictly.value) {
    let allparents = getStrictlyParents(leftNodes)
    let rightList = ArrayToTree(allparents)
    // halfCheckedKeys = allparents.map(el => el.VALUE).filter(el => !checkedKeys.includes(el))
    // allCheckedKeys = halfCheckedKeys.concat(checkedKeys)
    // TODO 直接直接设置右侧数据
    RightTreeData.value = lodash.cloneDeep(rightList)
  } else {
    const rightTree = RightTreeRef.value
    if (!rightTree) {
      let rightList = parents.map(parent => {
        const obj = lodash.omit(parent, ['CHILDREN'])
        obj.CHILDREN = lodash.filter(parent.CHILDREN, child => allCheckedKeys.indexOf(child.VALUE) >= 0)
        return obj
      })
      let copyRightList = lodash.cloneDeep(rightList)
      removeChecked(copyRightList, allCheckedKeys)
      RightTreeData.value.push(...copyRightList)
    } else {
      let isExist = false
      rightTree.data.forEach(e => {
        if (parents[0].VALUE === e.VALUE) isExist = true
      })
      if (!isExist) {
        const overall = lodash.cloneDeep(parents)
        let rightList = await recursionTree(overall, allCheckedKeys)
        let copyRightList = lodash.cloneDeep(rightList)
        removeChecked(copyRightList, allCheckedKeys)
        RightTreeData.value.push(...copyRightList)
      } else {
        handleData(leftNodes, rightTree, allCheckedKeys)
      }
    }
    // 移过去之后要删除原本的值
    leftNodes.forEach(node => {
      leftTree.setChecked(node, false, false)
      if (checkedKeys.indexOf(node.VALUE) >= 0) leftTree.remove(node)
    })
    leftOperation.value = formatTree(leftTree.getCheckedNodes(false) || [])
  }
  changeValue()
}
const delHandle = async () => {
  checkedRight.value = false
  const rightTree = RightTreeRef.value
  if (!rightTree) return
  const rightNodes = rightTree.getCheckedNodes(false, true)
  const checkedKeys = rightTree.getCheckedKeys(false)
  const halfCheckedKeys = rightTree.getHalfCheckedKeys()
  const allCheckedKeys = halfCheckedKeys.concat(checkedKeys)
  const parents = lodash.filter(
    rightNodes,
    // item => item.CHILDREN && item.CHILDREN.length > 0 && item.PK_PARENT == '0'
    item => item.PK_PARENT == '0'
  )
  const leftTree = LeftTreeRef.value
  if (!leftTree) {
    let leftList = parents.map(parent => {
      const obj = lodash.omit(parent, ['CHILDREN'])
      obj.CHILDREN = lodash.filter(parent.CHILDREN, child => allCheckedKeys.indexOf(child.VALUE) >= 0)
      return obj
    })
    let copyLeftList = lodash.cloneDeep(leftList)
    removeChecked(copyLeftList, allCheckedKeys)
    LeftTreeData.value.push(...copyLeftList)
  } else {
    let isExist = false
    leftTree.data.forEach(e => {
      if (parents[0].VALUE === e.VALUE) isExist = true
    })
    if (!isExist) {
      const overall = lodash.cloneDeep(parents)
      let leftList = await recursionTree(overall, allCheckedKeys)
      let copyLeftList = lodash.cloneDeep(leftList)
      removeChecked(copyLeftList, allCheckedKeys)
      RightTreeData.value.push(...copyLeftList)
    } else {
      handleData(rightNodes, leftTree, allCheckedKeys)
    }
  }
  rightNodes.forEach(node => {
    rightTree.setChecked(node, false, false)
    if (strictly.value) leftTree.setChecked(node, false, false)
    if (checkedKeys.indexOf(node.VALUE) >= 0) rightTree.remove(node)
  })
  rightOperation.value = formatTree(rightTree.getCheckedNodes(false) || [])
  changeValue()
}

// 树 数据
const TreeData = ref([])
const LeftArrayData = ref([])
const LeftTreeData = ref([])
const RightTreeData = ref([])

const onCheckLeft = () => {
  leftOperation.value = formatTree(LeftTreeRef.value.getCheckedNodes(false) || [])
}
const onCheckRight = () => {
  rightOperation.value = formatTree(RightTreeRef.value.getCheckedNodes(false) || [])
}

// 获取数据
const getData = (init = false) => {
  let { OTHER } = props.config;
  let { url, data } = ParseOtherConfig(OTHER);
  proxy.request({
    url: url,
    method: "post",
    data: {
      // KEYWORD: keyword,
      // MODULEID: MENUID,
      ...data,
    },
    headers: {
      repeatSubmit: false,
    },
  }).then(({ RESULT }) => {
    TreeData.value = RESULT
    LeftTreeData.value = TreeData.value
    LeftArrayData.value = treeToArray(TreeData.value)
    if (init) {
      const ids = props.modelValue ? props.modelValue.split(',') : []
      let initArr = getTreeById(ids)
      RightTreeData.value = initArr
    }
  })
}

// 解析 Other 配置
function ParseOtherConfig(config) {
  if (!config) {
    SelectValueTo.value = []
    return { url: "", data: {}, importantData: {} };
  }
  try {
    let newConfig = JSON.parse(config)[0]
    if (newConfig.setvalue && JSON.stringify(newConfig.setvalue) != '{}') {
      let arr = []
      for (const key in newConfig.setvalue) {
        arr.push({ k: key, v: newConfig.setvalue[key] })
      }
      SelectValueTo.value = arr
    }
    return { url: newConfig.url, data: newConfig?.params, importantData: newConfig?.importantData }
  } catch (error) {
    if (config.indexOf("/") == '0') {
      let paramsArr = config.split("?"),
        url = "",
        setQueryParam = {},
        queryJson = {},
        setImportantParam = {},
        importantData = {};
      if (paramsArr.length == 0) {
        url = config;
        SelectValueTo.value = [];
      } else if (paramsArr.length > 0) {
        url = paramsArr[0];
        if (paramsArr.length > 1) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[1], "obj");
          queryJson = obj
          importantData = importantObj
        }
        if (paramsArr.length > 2) {
          let { obj, importantObj } = GetUrlParams("a?" + paramsArr[2], "obj");
          setQueryParam = obj
          setImportantParam = importantObj
          queryJson = { ...queryJson, ...ConvertData(setQueryParam) }
          importantData = { ...importantData, ...ConvertData(setImportantParam) }
        }
        SelectValueTo.value = paramsArr[3] ? GetUrlParams("a?" + paramsArr[3], "arr") : []
      }
      return { url, data: queryJson, importantData };
    } else {
      console.error("配置解析错误!", error);
    }
  }
}

// 获取url 后面的参数
function GetUrlParams(url, backType) {
  let reg = /([^&?=]+)=([^&?=]+)/g,
    obj = {},
    importantObj = {},
    arr = [];
  url.replace(reg, function () {
    if (arguments[1].includes("!")) {
      let key = arguments[1].substr(1); //删除第一个字符
      importantObj[key] = arguments[2];
    } else {
      obj[arguments[1]] = arguments[2];
    }
    let objs = {};
    objs.k = arguments[1];
    objs.v = arguments[2];
    arr.push(objs);
  });
  return backType == "obj" ? { obj, importantObj } : arr;
}

// 格式化树
function formatTree(tree, parentKey = 'PK_PARENT', idKey = 'VALUE') {
  // 格式化选择的树：清除全选下面的子节点
  let swap,
    parentIds = [];
  // 先找出有children的id集合，再把所有的数据做对比，只要parentId和其中一个对上，就把该数据删除；
  tree.forEach((item, index) => {
    if (item.CHILDREN) {
      parentIds.push(item[idKey])
    }
  })
  swap = tree.filter((item, index) => {
    if (parentIds.indexOf(item[parentKey]) == -1) {
      return item
    }
  })
  return swap
}

function recursionTree(parents, allCheckedKeys) {
  parents.forEach(e => {
    const list = lodash.filter(e.CHILDREN, child => allCheckedKeys.indexOf(child.VALUE) >= 0)
    e.CHILDREN = list
    if (e.CHILDREN && e.CHILDREN.length !== 0) {
      recursionTree(e.CHILDREN, allCheckedKeys)
    }
  })
  return parents
}

function removeChecked(rightList, allCheckedKeys) {
  rightList.forEach((e, index) => {
    if (allCheckedKeys.indexOf(e.VALUE) == -1) {
      rightList.splice(index, 1)
    }
    if (e.CHILDREN) {
      removeChecked(e.CHILDREN, allCheckedKeys)
    }
  })
  return rightList
}

// 获取补充数据
function handleData(rightNodes, leftTree, allCheckedKeys) {
  rightNodes.forEach(item => {
    if (item.CHILDREN) {
      let parent = leftTree.getNode(item.PK_PARENT)
      let node = item
      if (!leftTree.getNode(item.VALUE) && allCheckedKeys.indexOf(item.VALUE) > 0) {
        const copyNode = lodash.cloneDeep(node)
        copyNode.CHILDREN = []
        leftTree.append(copyNode, parent)
      }
      handleData(item.CHILDREN, leftTree, allCheckedKeys)
    } else {
      let parent = leftTree.getNode(item.PK_PARENT)
      let node = item
      if (!leftTree.getNode(item.VALUE) && allCheckedKeys.indexOf(item.VALUE) > 0) {
        leftTree.append(node, parent)
      }
    }
  })
}

// 树结构装 转 一维数组
function traverse(node, result = []) {
  if (!node || !Array.isArray(node)) return result;
  node.forEach((item) => {
    result.push(item.VALUE);
    traverse(item.CHILDREN, result);
  });
  return result;
}

function changeValue() {
  const result = traverse(RightTreeData.value)
  emits('update:modelValue', result.toString());
}

// 扁平化树
function treeToArray(tree) {
  let res = []
  for (const item of tree) {
    const { CHILDREN, ...i } = item
    if (CHILDREN && CHILDREN.length) {
      res = res.concat(treeToArray(CHILDREN))
    }
    res.push(i)
  }
  return res
}

// 组装树
function ArrayToTree(data) {
  let config = {
    id: 'VALUE',
    parentId: 'PK_PARENT',
    childrenList: 'CHILDREN'
  };
  var childrenListMap = {};
  var nodeIds = {};
  var tree = [];
  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }
  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }
  for (let t of tree) {
    adaptToChildrenList(t);
  }
  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

// 获取父级
function getStrictlyParents(nodes) {
  let parents = [], allnode = []
  nodes.forEach(node => {
    const newnode = {
      ...node,
      CHILDREN: []
    }
    allnode.push(newnode)
    if (node.PK_PARENT === '0') return
    let parent = lodash.cloneDeep(LeftArrayData.value.find(el => el.VALUE === node.PK_PARENT))
    if (!parent) return
    allnode.push(parent)
    if (parent.PK_PARENT != '0') {
      const allparent = findParent(parent.PK_PARENT);
      allnode = [...allnode, ...allparent]
    }
  })
  parents = lodash.uniqBy(allnode, el => el.VALUE)
  return parents
}

// 根据节点id,找到所有的严格父级
function findParent(item) {
  const parentArr = []; // 存储所有的父级元素
  function find(item) {
    LeftArrayData.value.forEach(ele => {
      if (ele.VALUE === item) {
        parentArr.unshift(ele);
        find(ele.PK_PARENT);
      }
    })
  }
  find(item);
  return parentArr;
}

// 根据节点id 组装树结构
function getTreeById(ids) {
  if (!ids) return
  const parentArr = []; // 存储所有的父级元素
  ids.forEach(item => {
    const parent = findParent(item);
    parentArr.push(...parent)
  })
  const newparentArr = lodash.uniqBy(parentArr, el => el.VALUE)
  const tree = ArrayToTree(newparentArr);
  return tree
}

getData(true)
</script>
<style lang="scss" scoped>
.transfer {
  width: 100%;
  height: v-bind(hConfig); // 可配置高度
  display: flex;
  align-items: stretch;
  font-size: 16px; // TODO 全局字体大小
  &-item {
    min-height: 200px;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #fff;
    text-align: left;
    box-sizing: border-box;
    .header {
      background: #f5f7fa;
      height: 40px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      border: 1px solid #ebeef5;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    .content {
      height: 100%;
      border-left: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      overflow: hidden;
      .search {
        padding: 5px;
      }
      .tree-box {
        height: calc(100% - 40px);
      }
    }
  }
  &-left,
  &-right {
    width: v-bind(wItemConfig); // 可配置宽度
  }
  &-btn {
    width: 100px;
    padding: 20px;
    align-items: center;
    justify-content: center;
    .el-button {
      margin-bottom: 10px;
      margin-left: 0 !important;
    }
  }
}
</style>