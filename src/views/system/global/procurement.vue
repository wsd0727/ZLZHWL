<template>
  <div class="sales-app">
    <el-tabs v-model="pcName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="派车" name="pc">
        <el-form
          :inline="true"
          :model="formProcure"
          ref="globalRef"
          class="demo-form-inline"
        >
          <div class="divContent">
            派车单
            <el-input class="minInput oneinput" v-model="formProcure.PcdTime">
            </el-input
            >小时失效 采购派车量最小
            <el-input class="minInput oneinput" v-model="formProcure.Cgpcl">
            </el-input
            >吨
            <el-checkbox
              v-model="formProcure.isglsh"
              label="关联收货计划"
              size="large"
              class="oneinput"
            />
          </div>
          <!-- <el-form-item size="small"> -->
          <div class="divContent2">
            <el-checkbox
              v-model="formProcure.ispcd"
              label="派车单保存即审核(首单)"
              size="large"
            /><el-checkbox
              v-model="formProcure.isclyx"
              label="车辆允许同时有多个派车单"
              size="large"
            /><el-checkbox
              v-model="formProcure.isjpcd"
              label="司机允许同时有多个派车单"
              size="large"
            />
          </div>

          <!-- </el-form-item> -->
          <div class="divContent">
            <span>原发录入节点:</span>
            <el-radio-group v-model="formProcure.carZCF" class="ml-4">
              <el-radio label="1" size="small">不限制</el-radio>
              <el-radio label="2" size="small">派车</el-radio>
              <el-radio label="3" size="small">发卡/签到</el-radio>
              <el-radio label="4" size="small">收货确认</el-radio>
            </el-radio-group>
          </div>

          <el-form-item>
            原发允许最大值
            <el-input class="minInput" v-model="formProcure.yfyxz"> </el-input>吨
          </el-form-item>
          <el-form-item>
            采购循环派车订单量不足
            <el-input class="minInput" v-model="formProcure.cgxhpc"> </el-input
            >吨关闭派车单
          </el-form-item>

          <div>
            <span>采购派车图片最少</span>
            <el-input class="minInput" v-model="formProcure.cgpctp"> </el-input
            >张,
            <span>最多</span>
            <el-input class="minInput" v-model="formProcure.cgzd"> </el-input>张
            <div class="topBottom">
              <span>图片来源:</span>
              <el-checkbox
                v-model="formProcure.ispz"
                label="拍照"
                size="large"
              /><el-checkbox
                v-model="formProcure.isxc"
                label="相册"
                size="large"
              />
            </div>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="DateName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="排队" name="pd">
        <el-form :inline="true" :model="formProcure" class="demo-form-inline">
          <el-form-item label="厂外排队">
            <el-radio-group v-model="formProcure.iscwpd" class="ml-4">
              <el-radio label="1" size="small">无</el-radio>
              <el-radio label="2" size="small">签到</el-radio>
              <el-radio label="3" size="small">发卡</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formProcure.iscnpd" size="large" />
            厂内排队（一次计量先后顺序）
          </el-form-item>
          <el-form-item label="单价获取:">
            <el-radio-group v-model="formProcure.isdjhq" class="ml-4">
              <el-radio label="1" size="small">入厂</el-radio>
              <el-radio label="2" size="small">一次计量</el-radio>
              <el-radio label="3" size="small">二次计量</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="SlName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="收货" name="sh">
        <el-form :inline="true" :model="formProcure" class="demo-form-inline">
          <el-form-item label="收货确认">
            <el-radio-group v-model="formProcure.isshqr" class="ml-4">
              <el-radio label="1" size="small">无确认</el-radio>
              <el-radio label="2" size="small">先登记再确认</el-radio>
              <el-radio label="3" size="small">确认</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <span>排除0种物料</span>
            <a href="#" style="color: blue; margin-left: 10px">设置</a>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formProcure.iscyqr" size="large" />
            <span style="position: relative; left: -20px">采样确认</span>
            <span>已设置0种物料需采样确认</span>
            <a href="#" style="color: blue; margin-left: 10px">设置</a>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formProcure.ishyjg" size="large" />
            <span style="position: relative; left: -20px"
              >化验结果合格允许收货确认</span
            >
          </el-form-item>
          <el-form-item>
            采购收货图片最少
            <el-input class="minInput" v-model="formProcure.iscgshzp" />
            张, 最多
            <el-input class="minInput" v-model="formProcure.iscgshzd" />张
          </el-form-item>
          <el-form-item>
            <span style="margin-right: 10px">图片来源</span>
            <el-checkbox
              v-model="formProcure.iscgshtp1"
              label="拍照"
              size="large"
            /><el-checkbox
              v-model="formProcure.iscgshtp2"
              label="相册"
              size="large"
            />
          </el-form-item>

          <el-form-item>
            采购采样图片最小
            <el-input class="minInput" v-model="formProcure.iscyshzp" />
            张, 最多
            <el-input class="minInput" v-model="formProcure.iscyshzd" />张
          </el-form-item>

          <el-form-item>
            <span style="margin-right: 10px">图片来源</span>
            <el-checkbox
              v-model="formProcure.iscyshtp1"
              label="拍照"
              size="large"
            /><el-checkbox
              v-model="formProcure.iscyshtp2"
              label="相册"
              size="large"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="carName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="计量" name="jl">
        <el-form :inline="true" :model="formProcure" class="demo-form-inline">
          <div class="divContent">
            允许超载
            <el-input class="minInput" v-model="formProcure.isyxcz" />
            吨,
            <span>排除0种物料</span>
            <a href="#" style="color: blue; margin-left: 10px">设置物料、</a>
            <span>排除0个供应商</span>
            <a href="#" style="color: blue; margin-left: 10px">设置供应商、</a>
            <el-checkbox
              v-model="formProcure.iscyshtp1"
              label="处理超载数据"
              size="large"
              disabled
            />
          </div>
          <div class="divContent">
            原发与实收允差上限
            <el-input class="minInput" v-model="formProcure.isyfsh" />
            吨, 下限
            <el-input class="minInput" v-model="formProcure.isyfshxx" />吨
          </div>

          <div class="divContent">
            <span>原发录入节点:</span>
            <el-radio-group v-model="formProcure.isyflr" class="ml-4">
              <el-radio label="1" size="small">暗扣：</el-radio>
              百分比扣重
              <el-input class="minInput" v-model="formProcure.isbfkz" />
              %
              <el-radio label="2" size="small">按量扣重</el-radio>
              <el-input class="minInput" v-model="formProcure.isalkz" />
              吨
            </el-radio-group>
          </div>
          <div class="divContent">
            皮重异常校验
            <el-input class="minInput" v-model="formProcure.ispzyc" />吨
            <span style="margin-left: 80px">历史皮重取最近</span>
            <el-input class="minInput" v-model="formProcure.islspz" />车均值
            <span style="margin-left: 80px"> 原货出厂误差允许</span>
            <el-input class="minInput" v-model="formProcure.isyhccwc" />吨
          </div>

          <el-form-item>
            <el-input class="minInput" v-model="formProcure.carNum" />
            分钟内禁止重复计量
          </el-form-item>
          <el-form-item label="两次计量时间超">
            <el-input class="minInput" v-model="formProcure.cardeftule" />
            分钟发起审批
          </el-form-item>
          <el-form-item label="过皮后">
            <el-input class="minInput" v-model="formProcure.carserach" />
            分钟内未出厂预警
          </el-form-item>
          <el-form-item label="车辆出厂">
            <el-input class="minInput" v-model="formProcure.carPP" />
            分钟后不允许入厂
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formProcure.iscyshtp1"
              label="允许超订单量计量"
              size="large"
            /><el-checkbox
              v-model="formProcure.iscyshtp2"
              label="采购计量支付"
              size="large"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="logName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="打印" name="dy">
        <el-form :inline="true" :model="formProcure" class="demo-form-inline">
          <div class="divContent">
            <span>磅单打印</span>
            <el-input class="minInput" v-model="formProcure.carNum" />份
            <span style="margin-left: 80px"> 打印超 </span>
            <el-input
              class="minInput"
              v-model="formProcure.carNum"
            />次以上补打审批
            <span style="margin-left: 80px">磅单打印方式:</span>
            <el-radio-group v-model="formProcure.isbddy" class="ml-4">
              <el-radio label="1" size="small">直接打印</el-radio>
              <el-radio label="2" size="small">预览打印</el-radio>
            </el-radio-group>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="imgName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="精度" name="jd">
        <el-form :inline="true" :model="formProcure" class="demo-form-inline">
          <div class="divContent">
            <span>计量金额精度</span>
            <el-input class="minInput" v-model="formProcure.isjlje" />位,
            <span style="margin-left: 80px">取值方式:</span>
            <el-radio-group v-model="formProcure.isjljejd" class="ml-4">
              <el-radio label="1" size="small">四舍五入</el-radio>
              <el-radio label="2" size="small">去位</el-radio>
              <el-radio label="3" size="small">进位</el-radio>
              <el-radio label="4" size="small">四舍六入五成双</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>货款金额精度</span>
            <el-input class="minInput" v-model="formProcure.isjlje2" />位,
            <span style="margin-left: 80px">取值方式:</span>
            <el-radio-group v-model="formProcure.isjljejd2" class="ml-4">
              <el-radio label="1" size="small">四舍五入</el-radio>
              <el-radio label="2" size="small">去位</el-radio>
              <el-radio label="3" size="small">进位</el-radio>
              <el-radio label="4" size="small">四舍六入五成双</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>运费金额精度</span>
            <el-input class="minInput" v-model="formProcure.isjlje3" />位,
            <span style="margin-left: 80px">取值方式:</span>
            <el-radio-group v-model="formProcure.isjljejd3" class="ml-4">
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
const pcName = ref("pc");
const DateName = ref("pd");
const SlName = ref("sh");
const carName = ref("jl");
const logName = ref("dy");
const imgName = ref("jd");
const zzjName = ref("zzj");
const formProcure = ref({
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
  isjlje:"",
  isjljejd:"1",
  isjlje2:"",
  isjljejd2:"1",
  isjlje3:"",
  isjljejd3:"2",
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
        ...formProcure.value,
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
    formProcure.value = res;
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
