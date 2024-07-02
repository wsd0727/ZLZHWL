<template>
  <div class="system-app">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="系统信息" name="first">
        <div class="system-top">
          <el-form
            :inline="true"
            :model="formInline"
            :rules="rules"
            ref="systemRef"
            class="demo-form-inline"
            label-width="600"
          >
            <el-form-item label="系统名称" prop="system">
              <el-input v-model="formInline.system" placeholder="系统名称" />
            </el-form-item>
            <el-form-item label="授权单位">
              <el-input v-model="formInline.authorize" placeholder="授权单位" />
            </el-form-item>
            <el-form-item label="平台地址">
              <el-input v-model="formInline.platformUrl" placeholder="平台地址">
                <template #prepend>Http://</template>
              </el-input>
            </el-form-item>
            <el-form-item label="抓拍地址">
              <el-input v-model="formInline.captureUrl" placeholder="抓拍地址">
                <template #prepend>Http://</template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="PtName" class="demo-tabs">
      <el-tab-pane label="平台硬件" name="yj">
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          label-width="600"
        >
          <el-checkbox
            v-model="formInline.checked1"
            label="身份证阅读器"
            size="large"
          />
          <div class="bottomSelect">
            <el-form-item label="端口号">
              <el-select
                :disabled="formInline.checked1 == false"
                v-model="formInline.value1"
                class="m-2"
                placeholder="端口号"
                size="small"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="波特率">
              <el-select
                :disabled="formInline.checked1 == false"
                v-model="formInline.value2"
                class="m-2"
                placeholder="波特率"
                size="small"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="扩展地址盒">
              <el-select
                :disabled="formInline.checked1 == false"
                v-model="formInline.value3"
                class="m-2"
                placeholder="扩展地址盒"
                size="small"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-checkbox
            v-model="formInline.checked2"
            label="射频卡阅读器"
            size="large"
          />
          <div class="bottomSelect">
            <el-form-item label="端口号">
              <el-select
                :disabled="formInline.checked2 == false"
                v-model="formInline.Bvalue1"
                class="m-2"
                placeholder="端口号"
                size="small"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="波特率">
              <el-select
                :disabled="formInline.checked2 == false"
                v-model="formInline.Bvalue2"
                class="m-2"
                placeholder="波特率"
                size="small"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="扩展地址盒">
              <el-select
                :disabled="formInline.checked2 == false"
                v-model="formInline.Bvalue3"
                class="m-2"
                placeholder="扩展地址盒"
                size="small"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="systemBtn">
              <el-button type="primary" size="small" @click="systemSubmit"
                >保存</el-button
              >
              <el-button type="primary" size="small">重置</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { SubmintSystemData, getSystemList } from "@/api/system/global";
const { proxy } = getCurrentInstance();
const route = useRoute();
const activeName = ref("first");
const PtName = ref("yj");
const formInline = ref({
  system: "",
  authorize: "",
  platformUrl: "",
  captureUrl: "",
  checked1: false,
  checked2: false,
  value1: "",
  value2: "",
  value3: "",
  Bvalue1: "",
  Bvalue2: "",
  Bvalue3: "",
});
const rules = ref({
  system: [{ required: true, message: "系统名称不能为空", trigger: "blur" }],
});
const options = [
  {
    value: "COM1",
    label: "COM1",
  },
  {
    value: "COM2",
    label: "COM2",
  },
  {
    value: "COM3",
    label: "COM3",
  },
  {
    value: "COM4",
    label: "COM4",
  },
  {
    value: "COM5",
    label: "COM5",
  },
];
function systemSubmit() {
  proxy.$refs.systemRef.validate((valid) => {
    if (valid) {
      let data = {
        ...formInline.value,
        MODULEID: route.meta.BILLNO,
        PAGEID: route.meta.PBILLNO,
        VTYPE: "xtsz",
        VNAME: "系统设置",
      };
      SubmintSystemData(data).then((res) => {
        proxy.$modal.msgSuccess("保存成功");
        sysList();
      });
    }
  });
}
function sysList() {
  let data = {
    MODULEID: route.meta.BILLNO,
    PAGEID: route.meta.PBILLNO,
    VTYPE: "xtsz",
  };
  getSystemList(data).then((res) => {
    formInline.value = res;
  });
}
sysList();
</script>

<style lang="scss" scoped>
.system-app {
  .system-top {
  }
  .systemBtn {
    position: relative;
    left: 35%;
    margin-top: 35px;
  }
}
</style>
<style scoped>
:v-deep(.el-form-item__label) {
  font-weight: unset;
  font-size: 12px;
  position: relative;
  left: 5px;
}
:v-deep(.el-tabs__item) {
  margin-left: 5px;
}
</style>
