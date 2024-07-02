<template>
  <div class="sales-app">
    <el-tabs v-model="jhName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="计划" name="jh">
        <el-form
          :inline="true"
          :model="formTransfer"
          ref="globalRef"
          class="demo-form-inline"
        >
          <el-form-item>
            调拨计划量小于
            <el-input class="minInput" v-model="formTransfer.yfyxz"> </el-input
            >吨自动关闭
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formTransfer.ishyjg" size="large" />
            <span style="position: relative; left: -20px"
              >调拨计划审核即启用</span
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="DateName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="确认" name="pd">
        <el-form :inline="true" :model="formTransfer" class="demo-form-inline">
          <div class="divContent">
            <el-checkbox v-model="formTransfer.iscnpd" size="large" />
            <span style="margin-left: -20px">一步式发货确认</span>
            <el-checkbox
              style="margin-left: 20px"
              v-model="formTransfer.iscnpd"
              size="large"
            />
            <span style="margin-left: 10px">两步式调出发货确认</span>
            <span style="position: relative; left: 20px"
              >已排除0种物料调出发货确认</span
            >
            <a href="#" style="color: blue; margin-left: 25px">设置物料</a>
          </div>
          <div class="divContent">
            <el-checkbox v-model="formTransfer.iscnpd" size="large" />
            <span style="margin-left: -20px">一步式收货确认</span>
            <el-checkbox
              style="margin-left: 20px"
              v-model="formTransfer.iscnpd"
              size="large"
            />
            <span style="margin-left: 10px">两步式调入收货确认</span>
            <span style="position: relative; left: 20px"
              >已排除0种物料调入收货确认</span
            >
            <a href="#" style="color: blue; margin-left: 25px">设置物料</a>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="SlName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="超载" name="sh">
        <el-form :inline="true" :model="formTransfer" class="demo-form-inline">
          <el-form-item label="调出车辆允超">
            <el-input class="minInput" v-model="formTransfer.iscgshzp" />吨
            <span>已设置0种物料需调出超载确认</span>
            <a href="#" style="color: blue; margin-left: 25px">设置物料</a>
          </el-form-item>
          <el-form-item label="调出车辆允超">
            <el-input class="minInput" v-model="formTransfer.iscgshzp" />吨
            <span>已设置0种物料需调出超载确认</span>
            <a href="#" style="color: blue; margin-left: 25px">设置物料</a>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="carName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="计量" name="jl">
        <el-form :inline="true" :model="formTransfer" class="demo-form-inline">
          <el-form-item>
            <span>调出</span>
            <el-input class="minInput" v-model="formTransfer.carNum" />
            分钟内不允许重复计量
          </el-form-item>
          <el-form-item>
            <span>调入</span>
            <el-input class="minInput" v-model="formTransfer.cardeftule" />
            分钟内不允许重复计量
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formTransfer.iscnpd" size="large" />
            <span style="margin-left: -20px"> 回皮与磅号关联 </span>
          </el-form-item>
          <el-form-item>
            <span> 厂际调拨净重允差 </span>
            <el-input class="minInput" v-model="formTransfer.carPP" />
            吨
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formTransfer.iscyshtp1"
              label="允许超订单量计量"
              size="large"
            /><el-checkbox
              v-model="formTransfer.iscyshtp2"
              label="采购计量支付"
              size="large"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="logName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="打印" name="dy">
        <el-form :inline="true" :model="formTransfer" class="demo-form-inline">
          <div class="divContent">
            <span>磅单打印</span>
            <el-input class="minInput" v-model="formTransfer.carNum" />份
            <span style="margin-left: 80px"> 打印超 </span>
            <el-input
              class="minInput"
              v-model="formTransfer.carNum"
            />次以上补打审批
            <span style="margin-left: 80px">磅单打印方式:</span>
            <el-radio-group v-model="formTransfer.isbddy" class="ml-4">
              <el-radio label="1" size="small">直接打印</el-radio>
              <el-radio label="2" size="small">预览打印</el-radio>
            </el-radio-group>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="imgName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="精度" name="jd">
        <el-form :inline="true" :model="formTransfer" class="demo-form-inline">
          <div class="divContent">
            <span>计量金额精度</span>
            <el-input class="minInput" v-model="formTransfer.isjlje" />位,
            <span style="margin-left: 80px">取值方式:</span>
            <el-radio-group v-model="formTransfer.isjljejd" class="ml-4">
              <el-radio label="1" size="small">四舍五入</el-radio>
              <el-radio label="2" size="small">去位</el-radio>
              <el-radio label="3" size="small">进位</el-radio>
              <el-radio label="4" size="small">四舍六入五成双</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>货款金额精度</span>
            <el-input class="minInput" v-model="formTransfer.isjlje2" />位,
            <span style="margin-left: 80px">取值方式:</span>
            <el-radio-group v-model="formTransfer.isjljejd2" class="ml-4">
              <el-radio label="1" size="small">四舍五入</el-radio>
              <el-radio label="2" size="small">去位</el-radio>
              <el-radio label="3" size="small">进位</el-radio>
              <el-radio label="4" size="small">四舍六入五成双</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>运费金额精度</span>
            <el-input class="minInput" v-model="formTransfer.isjlje3" />位,
            <span style="margin-left: 80px">取值方式:</span>
            <el-radio-group v-model="formTransfer.isjljejd3" class="ml-4">
              <el-radio label="1" size="small">四舍五入</el-radio>
              <el-radio label="2" size="small">去位</el-radio>
              <el-radio label="3" size="small">进位</el-radio>
              <el-radio label="4" size="small">四舍六入五成双</el-radio>
            </el-radio-group>
          </div>
          <div class="Form-Button">
            <el-button type="primary" @click="globalSubmit">保存</el-button>
            <!-- <el-button>取消</el-button> -->
            <el-button type="primary" @click="sysList">还原默认认知</el-button>
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
const jhName = ref("jh");
const DateName = ref("pd");
const SlName = ref("sh");
const carName = ref("jl");
const logName = ref("dy");
const imgName = ref("jd");
const zzjName = ref("zzj");
const formTransfer = ref({
  //密码
  PcdTime: "",
  Cgpcl: "",
  isglsh: false,
  ispcd: false,
  isclyx: false,
  isjpcd: false,
  yfyxz: "",
  cgxhpc: "",
  cgpctp: "",
  cgzd: "",
  ispz: false,
  isxc: false,
  iscwpd: "1",
  iscnpd: false,
  isdjhq: "1",
  isshqr: "1",
  iscyqr: false,
  ishyjg: false,
  iscgshzp: "",
  iscgshzd: "",
  iscgshtp1: false,
  iscgshtp2: false,
  iscyshzp: "",
  iscyshzd: "",
  iscyshtp1: false,
  iscyshtp2: false,
  isyxcz: "",
  isyfsh: "",
  isyfshxx: "",
  isyflr: "1",
  isbfkz: "",
  isalkz: "",
  ispzyc: "",
  islspz: "",
  isyhccwc: "",
  isbddy: "1",
  isjlje: "",
  isjljejd: "1",
  isjlje2: "",
  isjljejd2: "1",
  isjlje3: "",
  isjljejd3: "2",
  carZCF: "1",

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
        ...formTransfer.value,
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
    formTransfer.value = res;
  });
}
sysList();
</script>

<style lang="scss" scoped>
.sales-app {
  .demo-form-inline {
    font-size: 13px;
    font-weight: inherit;
  }
  span {
    font-size: 14px;
  }
  .divContent {
    margin: 5px;
    margin-left: 0px;
    height: 40px;
    font-size: 14px;
    margin-bottom: 10px;
    .oneinput {
      margin: 10px;
      margin-left: 12px;
      font-size: 14px;
    }
  }
  .divContent2 {
    margin: 10px;
    margin-left: 0px;
    height: 40px;
    font-size: 14px;
  }
  .topBottom {
    display: inline-block;
    margin-left: 170px;
    font-size: 13px;
    span {
      margin-right: 30px;
      position: relative;
      top: -2px;
    }
  }
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
:v-deep(.el-form-item--small .el-form-item__label) {
  font-weight: inherit !important;
}
:v-deep(.global-app .tac .demo-form-inline .el-form-item) {
  width: 300px !important;
}
:v-deep(.el-radio.el-radio--small .el-radio__label) {
  font-size: 13px;
}
:v-deep(.el-radio.el-radio--small) {
  margin-right: 3px;
}
</style>
