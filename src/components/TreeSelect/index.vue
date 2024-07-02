<template>
  <div class="menuSelect">
    <template v-if="!detail && showTools">
      <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
      <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
      <el-checkbox v-model="menuFandZ">父子联动</el-checkbox>
    </template>
    <el-scrollbar>
      <el-tree class="tree-border" ref="menuRef" :data="dataTree" :show-checkbox="!detail" node-key="VALUE" :check-strictly="!menuFandZ" empty-text="暂无数据" :props="TreeProps" @check="TreeChange"></el-tree>
    </el-scrollbar>
  </div>
</template>

<script setup>
/**
 * 权限树多选 组件
 * @author WangJun
 * @date 2024-04-22
 * @param modelValue {Object}  绑定值
 * @param config {Object}  配置项
 * @param detail {Boolean} detail 是否为详情
 */
import lodash from 'lodash-es'

const props = defineProps({
  modelValue: String,
  config: Object,
  detail: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['update:modelValue'])
const { proxy } = getCurrentInstance();

// 配置
/**
 *  SLOTCFG: {
 *    Height: '300px', // 高度
 *    ShowTools:false, // 是否显示工具栏
 *  }
 */
const SLOTCFG = computed(() => {
  try {
    return JSON.parse(props.config.SLOTCFG)
  } catch (err) {
    console.error("权限树多选:插槽配置项错误", err);
    return {}
  }
})
const hConfig = computed(() => SLOTCFG.value?.Height || '300px')
const showTools = computed(() => SLOTCFG.value?.ShowTools || true)

const menuRef = ref(null)
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const menuFandZ = ref(true);

const TreeProps = reactive({
  label: "LABEL",
  children: "CHILDREN",
  // disabled: (data) => {
  //   let { VALUE } = data;
  //   return roleData.value.includes(VALUE)
  // }
})

// 树数据
const AllTreeData = ref([])
const dataTree = ref([])
// 获取数据
const getData = (init = false) => {
  let { OTHER } = props.config;
  let { url, data } = ParseOtherConfig(OTHER)
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
    AllTreeData.value = RESULT
    dataTree.value = AllTreeData.value
    if (init) {
      const ids = props.modelValue ? props.modelValue.split(',') : []
      if (ids.length) {
        menuFandZ.value = false
        nextTick(() => {
          if (props.detail) {
            dataTree.value = getTreeById(ids)
          } else {
            menuRef.value.setCheckedKeys(ids)
          }
        })
      }
    }
  })
}

/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value) {
  let treeList = dataTree.value;
  for (let i = 0; i < treeList.length; i++) {
    menuRef.value.store.nodesMap[treeList[i].VALUE].expanded = value;
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value) {
  menuRef.value.setCheckedNodes(value ? dataTree.value : []);
}
/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
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

// 根据节点id,找到所有的严格父级
function findParent(item) {
  const parentArr = []; // 存储所有的父级元素
  function find(item) {
    AllTreeData.value.forEach(ele => {
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

// Change
function TreeChange(row, Nodes) {
  let { checkedKeys, halfCheckedKeys } = Nodes
  let selectKeys = [...checkedKeys, ...halfCheckedKeys]
  emit("update:modelValue", selectKeys.toString())
}

getData(true)
</script>
<style lang="scss" scoped>
.menuSelect {
  width: 100%;
  height: v-bind(hConfig); // 可配置高度
}
</style>