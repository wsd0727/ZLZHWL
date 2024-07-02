<template>
  <el-dialog title="选择成员" v-model="visibleDialog" width="900px" append-to-body custom-class="promoter_person">
    <div class="person_body clear">
      <div class="deptbox">
        <div class="head-container">
          <el-input v-model="keyword" placeholder="请输入部门名称" clearable prefix-icon="Search" style="margin-bottom: 8px" />
        </div>
        <div class="scrollBox">
          <el-scrollbar class="tree-border">
            <el-tree ref="deptTreeRef" :data="menuOptions" :props="{ label: 'LABEL', children: 'CHILDREN' }" node-key="VALUE" :filter-node-method="filterNode" highlight-current :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick" />
          </el-scrollbar>
        </div>
      </div>
      <div class="userbox">
        <div class="user-head">{{DeptName}}</div>
        <div class="scrollBox">
          <el-scrollbar class="tree-border">
            <!-- <ul>
              <li v-for="item in UserOptions" :key="item.BILLNO">
                <a :class="isActive(item.BILLNO) && 'active'" @click="change(item)" :title="item.VNAME">
                  <img src="@/assets/images/workflow/icon_people.png">{{item.VNAME}}
                </a>
              </li>
            </ul> -->
            <selectBox :list="list" />
          </el-scrollbar>
        </div>
      </div>
      <selectResult :total="total" @del="delList" :list="resList" />
    </div>
    <template #footer>
      <el-button @click="$emit('update:visible',false)">取 消</el-button>
      <el-button type="primary" @click="saveDialog">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import selectBox from '../selectBox.vue';
import selectResult from '../selectResult.vue';
import { UserList, deptTreeSelect } from "#/system/user";
// import { computed, watch, ref } from 'vue';
import { departments, getDebounceData, getDepartmentList, searchVal } from './common'
import $func from '../plugins/preload.js'
let props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: () => []
  },
  isDepartment: {
    type: Boolean,
    default: false
  },
});
let emits = defineEmits(['update:visible', 'change'])
let visibleDialog = computed({
  get() {
    return props.visible
  },
  set() {
    keyword.value = ""
    closeDialog()
  }
});
const deptTreeRef = ref(null)
const treeHeight = '300px';
let checkedDepartmentList = ref([])
let checkedEmployessList = ref([])
const checkedUserIDs = ref([])

let list = computed(() => {
  return [{
    isDepartment: props.isDepartment,
    type: 'department',
    data: departments.value.childDepartments,
    isActive: (item) => $func.toggleClass(checkedDepartmentList.value, item, "BILLNO"),
    change: (item) => $func.toChecked(checkedDepartmentList.value, item, "BILLNO"),
    next: (item) => getDepartmentList(item.BILLNO)
  }, {
    type: 'employee',
    data: UserOptions.value,
    isActive: (item) => $func.toggleClass(checkedEmployessList.value, item, "BILLNO"),
    change: (item) => $func.toChecked(checkedEmployessList.value, item, "BILLNO"),
  }]
})
let resList = computed(() => {
  let data = [{
    type: 'employee',
    data: checkedEmployessList.value,
    cancel: (item) => $func.removeEle(checkedEmployessList.value, item, "BILLNO")
  }]
  if (props.isDepartment) {
    data.unshift({
      type: 'department',
      data: checkedDepartmentList.value,
      cancel: (item) => $func.removeEle(checkedDepartmentList.value, item, "BILLNO")
    })
  }
  return data
})
watch(() => props.visible, (val) => {
  if (val) {
    getDeptTree();
    // getDepartmentList();
    searchVal.value = "";
    checkedEmployessList.value = props.data.filter(item => item.type === 1).map(({ name, targetId }) => ({
      VNAME: name,
      BILLNO: targetId
    }));
    checkedUserIDs.value = checkedEmployessList.value.map(el => el.BILLNO)
    checkedDepartmentList.value = props.data.filter(item => item.type === 3).map(({ name, targetId }) => ({
      departmentName: name,
      BILLNO: targetId
    }));
  }
})

const closeDialog = () => {
  emits('update:visible', false)
}

let total = computed(() => checkedEmployessList.value.length)

let saveDialog = () => {
  let checkedList = [
    // ...checkedDepartmentList.value,
    ...checkedEmployessList.value
  ].map(item => ({
    type: 1,
    targetId: item.BILLNO,
    name: item.VNAME
  }))
  emits('change', checkedList)
}
const delList = () => {
  // checkedDepartmentList.value = [];
  checkedEmployessList.value = []
}


// 新增内容
const menuOptions = ref([]);
const keyword = ref("");
watch(keyword, (val) => {
  deptTreeRef.value.filter(val)
})
const DeptName = ref("");
const getDeptTree = () => {
  deptTreeSelect().then((res) => {
    menuOptions.value = res.RESULT;
  });
};
const filterNode = (value, data) => {
  if (!value) return true;
  return data.LABEL.indexOf(value) !== -1;
};
const handleNodeClick = (val) => {
  let { VALUE, LABEL, TYPE } = val;
  DeptName.value = LABEL
  if (TYPE == "ORG") {
    queryParams.value.PK_ORG = VALUE;
    queryParams.value.PK_DEPT = "";
  } else {
    queryParams.value.PK_ORG = "";
    queryParams.value.PK_DEPT = VALUE;
  }
  getUserList();
};
const queryParams = ref({
  PK_ORG: "",
  PK_DEPT: "",
  PAGENUM: 1,
  PAGESIZE: 10000
})
const UserOptions = ref([])
const getUserList = () => {
  UserList(queryParams.value).then((res) => {
    UserOptions.value = res.RESULT.RECORDS;
  })
}
const change = row => {
  if (checkedEmployessList.value.find(el => el.BILLNO == row.BILLNO)) {
    checkedEmployessList.value = checkedEmployessList.value.filter(el => el.BILLNO != row.BILLNO)
  } else {
    checkedEmployessList.value.push(row)
  }
  checkedUserIDs.value = checkedEmployessList.value.map(el => el.BILLNO)
}
const isActive = val => checkedUserIDs.value.includes(val)

</script>
<style lang="scss" scoped>
@import "../css/dialog.css";
</style>

<style lang="scss" scoped>
.person_body {
  display: flex;
  .deptbox,
  .userbox {
    width: 300px;
  }
  .scrollBox {
    height: 460px;
  }
  .userbox {
    margin: 0 20px;
    .user-head {
      height: 32px;
      line-height: 32px;
    }
    ul {
      padding: 10px;
      margin: 0;
      li {
        position: relative;
        display: flex;
        align-items: center;
        list-style: none;
        line-height: 20px;
        margin-bottom: 5px;
        padding-left: 20px;
        a {
          cursor: pointer;
          &::before {
            position: absolute;
            width: 14px;
            height: 14px;
            border: 1px solid #dcdfe6;
            border-radius: 2px;
            left: 0;
            top: 1px;
            content: "";
          }
          &.active {
            &::after {
              background: url(/src/assets/images/workflow/check_box.png)
                no-repeat center;
              position: absolute;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              top: 3px;
              left: 3px;
              content: "";
            }
          }
        }
        img {
          width: 14px;
          vertical-align: text-top;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>