<template>
  <div>
    <el-tabs v-model="pwdName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="密码策略" name="pwd">
        <el-form
          :inline="true"
          :model="formglobal"
          ref="globalRef"
          class="demo-form-inline"
        >
          <el-form-item>
            <el-checkbox
              v-model="formglobal.pwdChecked"
              label="首次登录系统需更改密码"
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formglobal.pwdChecked1"
              label="密码失效周期"
              size="large"
            />
            <el-input
              :disabled="formglobal.pwdChecked1 != true"
              class="minInput"
              v-model="formglobal.pwdChecked1Day"
            >
            </el-input
            >天
          </el-form-item>
          <el-form-item>
            密码错误
            <el-input class="minInput" v-model="formglobal.pwdYzm"> </el-input
            >次输入验证码
          </el-form-item>
          <el-form-item>
            密码错误
            <el-input class="minInput" v-model="formglobal.pwdDj"> </el-input
            >次冻结账号
            <el-input class="minInput" v-model="formglobal.pwdmin"> </el-input
            >分钟
          </el-form-item>
          <el-form-item label="平台密码策略">
            <el-select v-model="formglobal.pwdLength" class="m-2" size="small">
              <el-option
                v-for="item in pwdOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="手机密码策略">
            <el-select v-model="formglobal.pwdIphone" class="m-2" size="small">
              <el-option
                v-for="item in IPhoneOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="DateName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="统计日期" name="date">
        <el-form :inline="true" :model="formglobal" class="demo-form-inline">
          <el-form-item>
            磅单报表月统计周期
            <el-input class="minInput" v-model="formglobal.datebdQD" />日至
            <el-input class="minInput" v-model="formglobal.datebdZD" />日
          </el-form-item>
          <el-form-item>
            磅单报表日统计周期
            <el-input class="minInput" v-model="formglobal.datebdStime" />时至
            <el-input class="minInput" v-model="formglobal.datebdEtime" />时
          </el-form-item>
          <el-form-item>
            业务报表月统计周期
            <el-input class="minInput" v-model="formglobal.dateywQD" />日至
            <el-input class="minInput" v-model="formglobal.dateywZD" />日
          </el-form-item>
          <el-form-item>
            业务报表月统计周期
            <el-input class="minInput" v-model="formglobal.dateywStime" />时至
            <el-input class="minInput" v-model="formglobal.dateywEtime" />时
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="SlName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="税率" name="sl">
        <el-form :inline="true" :model="formglobal" class="demo-form-inline">
          <el-form-item>
            货物
            <el-input class="minInput" v-model="formglobal.SlDate"> </el-input>%
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="carName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="车辆" name="car">
        <el-form :inline="true" :model="formglobal" class="demo-form-inline">
          <el-form-item label="车牌默认省份">
            <el-input class="minInput" v-model="formglobal.carSF" />
          </el-form-item>
          <el-form-item label="车号输入">
            <el-input class="minInput" v-model="formglobal.carNum" />
            位触发查询
          </el-form-item>
          <el-form-item label="默认取前">
            <el-input class="minInput" v-model="formglobal.cardeftule" />
            条
          </el-form-item>
          <el-form-item label="车号查询间隔">
            <el-input class="minInput" v-model="formglobal.carserach" />
            毫秒进行查询
          </el-form-item>
          <el-form-item label="车牌识别匹配">
            <el-input class="minInput" v-model="formglobal.carPP" />
            位
          </el-form-item>
          <el-form-item label=""> </el-form-item>
          <el-form-item label="装车费">
            <el-radio-group v-model="formglobal.carZCF" class="ml-4">
              <el-radio label="1" size="small">按次</el-radio>
              <el-radio label="2" size="small">按吨 计算</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="装车费单价">
            <el-input class="minInput" v-model="formglobal.carZCDJ" />
            元
          </el-form-item>
          <el-form-item label="卸车费">
            <el-radio-group v-model="formglobal.carXCF" class="ml-4">
              <el-radio label="1" size="small">按次</el-radio>
              <el-radio label="2" size="small">按吨 计算</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="卸车费单价">
            <el-input class="minInput" v-model="formglobal.carXCDJ" />
            元
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-checkbox
              v-model="formglobal.carChecked"
              label="派车选择车辆带出当前业务的最新司机"
              size="small"
            />
            首次选择前<el-input
              class="minInput"
              :disabled="formglobal.carChecked == false"
              v-model="formglobal.carXZ"
            />
            个司机为当前业务关联车辆最新的派车单中司机
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formglobal.carSFZ"
              label="入厂车牌识别验证身份证"
              size="small"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="logName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="日志" name="log">
        <el-form :inline="true" :model="formglobal" class="demo-form-inline">
          <el-form-item>
            <el-checkbox
              v-model="formglobal.kjLog"
              label="开启系统日志"
              size="small"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formglobal.kqSQL"
              label="开启SQL日志输出"
              size="small"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formglobal.LogDS"
              label="日志定时清理（保留近30天）"
              size="small"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="imgName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="图片" name="img">
        <el-form :inline="true" :model="formglobal" class="demo-form-inline">
          <el-form-item>
            图片压缩比例
            <el-input class="minInput" v-model="formglobal.imgYS"> </el-input>%
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="formglobal.imgSY" class="ml-4">
              <el-radio label="1" size="small">左上</el-radio>
              <el-radio label="2" size="small">右上</el-radio>
              <el-radio label="3" size="small">左下</el-radio>
              <el-radio label="4" size="small">右下</el-radio>
              <el-radio label="5" size="small">居中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formglobal.imgSFZyx"
              label="身份证有效期验证"
              size="small"
            />
          </el-form-item>
          <el-form-item>
            在线用户获取频率
            <el-input class="minInput" v-model="formglobal.imgUser"> </el-input
            >分钟
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs
      v-model="zzjName"
      class="demo-tabs End-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="自助机" name="zzj">
        <el-form :inline="true" :model="formglobal" class="demo-form-inline">
          <el-form-item>
            离线间隔时间
            <el-input class="minInput" v-model="formglobal.zzjtime"> </el-input
            >分钟
          </el-form-item>
          <el-form-item>
            自助机密码
            <el-input type="password" v-model="formglobal.zzjpwd"> </el-input>
          </el-form-item>
        </el-form>
        <div class="Form-Button">
          <el-button type="primary" @click="globalSubmit">保存</el-button>
          <!-- <el-button>取消</el-button> -->
          <el-button type="primary" @click="sysList">还原默认认知</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { SubmintSystemData, getSystemList } from "@/api/system/global";
const { proxy } = getCurrentInstance();
const route = useRoute();
const pwdName = ref("pwd");
const DateName = ref("date");
const SlName = ref("sl");
const carName = ref("car");
const logName = ref("log");
const imgName = ref("img");
const zzjName = ref("zzj");
const formglobal = ref({
  //密码
  pwdChecked: false,
  pwdChecked1: false,
  pwdChecked1Day: "",
  pwdYzm: "3",
  pwdDj: "",
  pwdmin: "",
  pwdLength: "1",
  pwdIphone: "2",
  //日期
  datebdQD: "1",
  datebdZD: "31",
  datebdStime: "18:00:00",
  datebdEtime: "17:59:59",
  dateywQD: "1",
  dateywZD: "31",
  dateywStime: "18:00:00",
  dateywEtime: "17:59:59",
  SlDate: "13",
  //车辆
  carSF: "黄晋",
  carNum: "3",
  cardeftule: "100",
  carserach: "50",
  carPP: "5",
  carZCF: "1",
  carZCDJ: "0",
  carXCF: "1",
  carXCDJ: "0",
  carChecked: false,
  carXZ: "1",
  carSFZ: false,
  //日志
  kjLog: true,
  kqSQL: true,
  LogDS: true,
  //图片
  imgYS: "60",
  imgSY: "1",
  imgSFZyx: false,
  imgUser: "30",
  //自助机
  zzjtime: "30",
  zzjpwd: "1234123",
});
const pwdOptions = [
  {
    value: "1",
    label: "长度为8-20位，由大写、小写字母和数字组成",
  },
  {
    value: "2",
    label: "长度为8-20位，由字母、数字和特殊字符组成",
  },
];

const IPhoneOptions = [
  {
    value: "1",
    label: "不验证",
  },
  {
    value: "2",
    label: "长度为8-20位，由大写、小写字母和数字组成",
  },
  {
    value: "3",
    label: "长度为8-20位，由字母、数字和特殊字符组成",
  },
  {
    value: "4",
    label: "长度为8-20位字母+数字",
  },
];
function globalSubmit() {
  proxy.$refs.globalRef.validate((valid) => {
    if (valid) {
      let data = {
        ...formglobal.value,
        MODULEID: route.meta.BILLNO,
        PAGEID: route.meta.PBILLNO,
        VTYPE: "qjsz",
        VNAME: "全局设置",
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
    VTYPE: "qjsz",
  };
  getSystemList(data).then((res) => {
    formglobal.value = res;
  });
}
sysList();
</script>

<style lang="scss" scoped>
.global-app .tac .global-tabs .minInput {
  border-bottom: none !important;
}
.Form-Button {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  margin-left: -120px;
}
</style>
<style scoped>
:v-deep(.el-input) {
  border: none;
  border-bottom: 0px solid #ddd !important;
}
:v-deep(.el-form-item--small .el-form-item__label){
  font-weight: inherit !important;
}
</style>
