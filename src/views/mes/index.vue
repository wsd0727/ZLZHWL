<template>
  <div class="app-warp">
    <div class="tool-wrap">
      <el-row class="group mb6" justify="space-between">
        <el-col :span="20">
          <el-form
            ref="queryRef"
            :inline="true"
            :model="Query"
            class="query-form"
            label-width="0"
          >
            <el-form-item prop="VNAME" style="width: 150px">
              <el-input
                v-model="Query.keyword"
                placeholder="部门名称"
                clearable
              />
            </el-form-item>
            <el-form-item prop="MOBILE" style="width: 150px">
              <el-input
                v-model="Query.keycode"
                placeholder="部门编号"
                clearable
              />
            </el-form-item>
            <el-form-item prop="BILLSTATUS" style="width: 150px">
              <el-input
                v-model="Query.keydept"
                placeholder="上级部门"
                clearable
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" class="flex-row-end">
          <el-row :gutter="5">
            <el-col :span="1.5">
              <el-tooltip content="搜索" placement="top" effect="customized">
                <el-button type="primary" @click="handleSearch">查询</el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="1.5">
              <el-tooltip content="重置" placement="top" effect="customized">
                <el-button @click="resetSearch">重置</el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- <splitpanes class="default-theme" horizontal style="height: 400px">
      <el-row class="row-bg" justify="space-between">
        <el-col :span="4">
          <pane min-size="5" max-size="25">
            
          </pane>
        </el-col>
        <el-col :span="20">
          <pane>
            <span>2</span>
          </pane>
          <pane max-size="70">
            <span>3</span>
          </pane>
        </el-col>
      </el-row>
    </splitpanes> -->
    <div style="margin-top: 10px">
      <splitpanes style="height: 600px">
        <pane min-size="10" max-size="20">
          <div class="tree-left">
            <el-tree
              :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
            />
          </div>
        </pane>
        <pane style="margin-left: 5px">
          <splitpanes horizontal style="height: 600px">
            <pane min-size="25" max-size="80" style="margin-bottom: 3px">
              <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="User" name="first">
                  <vxe-table
                    border
                    show-header-overflow
                    show-overflow
                    :row-config="{ isHover: true }"
                    :data="tableData2"
                  >
                    <vxe-column type="seq" title="序号" width="60"></vxe-column>
                    <vxe-column field="name" title="Name"></vxe-column>
                    <vxe-column field="sex" title="Sex"></vxe-column>
                    <vxe-column field="age" title="Age"></vxe-column>
                    <vxe-column field="address" title="Address"></vxe-column>
                  </vxe-table>
                </el-tab-pane>
                <el-tab-pane label="Config" name="second">
                  <vxe-table
                    border
                    show-header-overflow
                    show-overflow
                    :row-config="{ isHover: true }"
                    :data="tableData2"
                  >
                    <vxe-column type="seq" title="序号" width="60"></vxe-column>
                    <vxe-column field="name" title="Name"></vxe-column>
                    <vxe-column field="sex" title="Sex"></vxe-column>
                    <vxe-column field="age" title="Age"></vxe-column>
                    <vxe-column field="address" title="Address"></vxe-column>
                  </vxe-table>
                </el-tab-pane>
                <el-tab-pane label="Role" name="third">
                  <vxe-table
                    border
                    show-header-overflow
                    show-overflow
                    :row-config="{ isHover: true }"
                    :data="tableData2"
                  >
                    <vxe-column type="seq" title="序号" width="60"></vxe-column>
                    <vxe-column field="name" title="Name"></vxe-column>
                    <vxe-column field="sex" title="Sex"></vxe-column>
                    <vxe-column field="age" title="Age"></vxe-column>
                    <vxe-column field="address" title="Address"></vxe-column>
                  </vxe-table>
                </el-tab-pane>
                <el-tab-pane label="Task" name="fourth">
                  <vxe-table
                    border
                    show-header-overflow
                    show-overflow
                    :row-config="{ isHover: true }"
                    :data="tableData2"
                  >
                    <vxe-column type="seq" title="序号" width="60"></vxe-column>
                    <vxe-column field="name" title="Name"></vxe-column>
                    <vxe-column field="sex" title="Sex"></vxe-column>
                    <vxe-column field="age" title="Age"></vxe-column>
                    <vxe-column field="address" title="Address"></vxe-column>
                  </vxe-table>
                </el-tab-pane>
              </el-tabs>
            </pane>
            <pane min-size="25" max-size="80" style="margin-top: 3px">
              <el-tabs v-model="activeName1" class="demo-tabs">
                <el-tab-pane label="User" name="first">
                  <vxe-table
                    border
                    show-header-overflow
                    show-overflow
                    :row-config="{ isHover: true }"
                    :data="tableData2"
                  >
                    <vxe-column type="seq" title="序号" width="60"></vxe-column>
                    <vxe-column field="name" title="Name"></vxe-column>
                    <vxe-column field="sex" title="Sex"></vxe-column>
                    <vxe-column field="age" title="Age"></vxe-column>
                    <vxe-column field="address" title="Address"></vxe-column>
                  </vxe-table>
                </el-tab-pane>
                <el-tab-pane label="Config" name="second">
                  <vxe-table
                    border
                    show-header-overflow
                    show-overflow
                    :row-config="{ isHover: true }"
                    :data="tableData2"
                  >
                    <vxe-column type="seq" title="序号" width="60"></vxe-column>
                    <vxe-column field="name" title="Name"></vxe-column>
                    <vxe-column field="sex" title="Sex"></vxe-column>
                    <vxe-column field="age" title="Age"></vxe-column>
                    <vxe-column field="address" title="Address"></vxe-column>
                  </vxe-table>
                </el-tab-pane>
                <el-tab-pane label="Role" name="third">
                  <vxe-table
                    border
                    show-header-overflow
                    show-overflow
                    :row-config="{ isHover: true }"
                    :data="tableData2"
                  >
                    <vxe-column type="seq" title="序号" width="60"></vxe-column>
                    <vxe-column field="name" title="Name"></vxe-column>
                    <vxe-column field="sex" title="Sex"></vxe-column>
                    <vxe-column field="age" title="Age"></vxe-column>
                    <vxe-column field="address" title="Address"></vxe-column>
                  </vxe-table>
                </el-tab-pane>
                <el-tab-pane label="Task" name="fourth">
                  <vxe-table
                    border
                    show-header-overflow
                    show-overflow
                    :row-config="{ isHover: true }"
                    :data="tableData2"
                  >
                    <vxe-column type="seq" title="序号" width="60"></vxe-column>
                    <vxe-column field="name" title="Name"></vxe-column>
                    <vxe-column field="sex" title="Sex"></vxe-column>
                    <vxe-column field="age" title="Age"></vxe-column>
                    <vxe-column field="address" title="Address"></vxe-column>
                  </vxe-table>
                </el-tab-pane>
              </el-tabs>
            </pane>
          </splitpanes>
        </pane>
      </splitpanes>
    </div>
  </div>
</template>

<script setup name="">
import { Search } from "@element-plus/icons-vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
const Query = reactive({
  keyword: "",
  keycode: "",
  keydept: "",
  keyorange: "",
});
const tableData2 = ref([
  {
    id: 10001,
    name: "Test1",
    role: "Develop",
    sex: "Man",
    age: 28,
    address: "test abc",
  },
  {
    id: 10002,
    name: "Test2",
    role: "Test",
    sex: "Women",
    age: 22,
    address: "Guangzhou",
  },
  {
    id: 10003,
    name: "Test3",
    role: "PM",
    sex: "Man",
    age: 32,
    address: "Shanghai",
  },
  {
    id: 10004,
    name: "Test4",
    role: "Designer",
    sex: "Women",
    age: 24,
    address: "Shanghai",
  },
]);
const activeName = ref("first");
const activeName1 = ref("first");

const data = [
  {
    label: "Level one 1",
    children: [
      {
        label: "Level two 1-1",
        children: [
          {
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  {
    label: "Level one 2",
    children: [
      {
        label: "Level two 2-1",
        children: [
          {
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        label: "Level two 2-2",
        children: [
          {
            label: "Level three 2-2-1",
          },
        ],
      },
    ],
  },
  {
    label: "Level one 3",
    children: [
      {
        label: "Level two 3-1",
        children: [
          {
            label: "Level three 3-1-1",
          },
        ],
      },
      {
        label: "Level two 3-2",
        children: [
          {
            label: "Level three 3-2-1",
          },
        ],
      },
    ],
  },
];
</script>

<style lang="scss" scoped>
.splitpanes__pane {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // position: relative;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2) inset;
}
.app-warp {
  background: #fff;
}
em.specs {
  font-size: 0.2em;
  line-height: 1;
  position: absolute;
  color: #bbb;
  bottom: 0.5em;
  left: 0;
  right: 0;
  text-align: center;
}
.flex-row-end {
  margin-top: 10px;
}
.tool-wrap {
  margin: 0px 0px 10px 0px;
  position: relative;
  top: 5px;
}
.header-right {
  width: 725px;
  div {
    width: 200px;
  }
  :v-deep(.el-input) {
    width: 150px;
  }
}
.tree-left {
  position: absolute;
  top: 50px;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.btnClass {
  position: absolute;
  right: 2%;
}
.default-theme.splitpanes--vertical > .splitpanes__splitter,
.default-theme .splitpanes--vertical > .splitpanes__splitter {
  width: 7px;
  border-left: 1px solid #eee;
  margin-left: -1px;
}
:deep(.el-tabs__header) {
  padding: 6px !important;
}
:deep(.tree-left[data-v-3fbe1bf4]) {
  position: absolute;
  top: 60px;
}
</style>
