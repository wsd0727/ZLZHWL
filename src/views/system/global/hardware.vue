<template>
  <div>
    <el-form :inline="true" :model="formhost" class="demo-form-host">
      <el-form-item label="主机">
        <el-input v-model="formhost.host" placeholder="主机" />
      </el-form-item>
      <el-form-item label="单据状态">
        <el-input v-model="formhost.status" placeholder="单据状态" />
      </el-form-item>
      <el-form-item label="硬件类型">
        <el-input v-model="formhost.tjtype" placeholder="硬件类型" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <vxe-table
      border
      :data="tableData1"
      highlight-hover-row
      size="mini"
      header-row-class-name="bg-blue"
    >
      <vxe-column type="seq" width="60"></vxe-column>
      <vxe-column field="name" title="Name"></vxe-column>
      <vxe-column field="sex" title="Sex"></vxe-column>
      <vxe-column field="age" title="Age"></vxe-column>
      <vxe-column field="address" title="Address" show-overflow></vxe-column>
    </vxe-table>
  </div>
</template>

<script setup>
const tableData1 = ref([
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
    age: 23,
    address: "test abc",
  },
  {
    id: 10005,
    name: "Test5",
    role: "Develop",
    sex: "Women",
    age: 30,
    address: "Shanghai",
  },
  {
    id: 10006,
    name: "Test6",
    role: "Designer",
    sex: "Women",
    age: 21,
    address: "test abc",
  },
  {
    id: 10007,
    name: "Test7",
    role: "Test",
    sex: "Man",
    age: 29,
    address: "test abc",
  },
  {
    id: 10008,
    name: "Test8",
    role: "Develop",
    sex: "Man",
    age: 35,
    address: "test abc",
  },
]);
const formhost = reactive({
  host: "",
  status: "",
  yjtype: "",
});
</script>

<style lang="scss" scoped></style>
