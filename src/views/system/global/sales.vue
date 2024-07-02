<template>
  <div class="sales-app">
    <el-tabs v-model="pcName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="订单" name="order">
        <el-form
          :inline="true"
          :model="formsales"
          ref="globalRef"
          class="demo-form-inline"
        >
          <el-form-item>
            <el-checkbox
              v-model="formsales.isxsddkz"
              label="销售订单控制逻辑为金额时按收款方式排序扣减余额"
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formsales.istjbc"
              label="调价保存即审核"
              size="large"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="DateName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="派车" name="pc">
        <el-form :inline="true" :model="formsales" class="demo-form-inline">
          <div class="divContent">
            派车单
            <el-input class="minInput oneinput" v-model="formsales.PcdTime">
            </el-input>
            <span style="margin-right: 180px"> 小时失效 销售派车量最小 </span>
            <el-input class="minInput oneinput" v-model="formsales.isxspcl">
            </el-input>
            <span style="margin-right: 180px">吨</span>
            <el-checkbox
              v-model="formsales.isglsh"
              label="关联收货计划"
              size="large"
              class="oneinput"
            />
          </div>
          <div class="divContent">
            <el-checkbox
              v-model="formsales.ispcdbc"
              label="派车单保存即审核"
              size="large"
            />
            <el-checkbox
              v-model="formsales.isclyx"
              label="车辆允许同时有多个派车单"
              size="large"
            />
            <el-checkbox
              v-model="formsales.issjyx"
              label="司机允许同时有多个派车单"
              size="large"
            />
          </div>
          <div class="divContent">
            <span>销售循环派车订单量不足</span>
            <el-input class="minInput oneinput" v-model="formsales.xsxhpcdd">
            </el-input>
            <span>吨关闭派车单</span>
          </div>
          <el-form-item>
            <span>销售派车图片最少</span>
            <el-input class="minInput oneinput" v-model="formsales.isxspctp">
            </el-input
            >张，
            <span>最多</span>
            <el-input class="minInput oneinput" v-model="formsales.isxspctpzs">
            </el-input
            >张，
          </el-form-item>
          <div class="topBottom">
            <span>图片来源:</span>
            <el-checkbox
              v-model="formsales.ispz"
              label="拍照"
              size="large"
            /><el-checkbox v-model="formsales.isxc" label="相册" size="large" />
          </div>
          <el-form-item>
            <el-checkbox
              v-model="formsales.isxxddlj"
              label="销售订单控制逻辑为金额时派车验余额"
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formsales.isxxclks"
              label="销售车辆是否验证入厂考试"
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formsales.isxsddljje"
              label="销售订单控制逻辑为金额时派车验余额"
              size="large"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="SlName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="排队" name="pd">
        <el-form :inline="true" :model="formsales" class="demo-form-inline">
          <el-form-item label="厂外排队:">
            <el-radio-group v-model="formsales.cwpd" class="ml-4">
              <el-radio label="1" size="small">无</el-radio>
              <el-radio label="2" size="small">签到</el-radio>
              <el-radio label="3" size="small">发卡</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formsales.cnpdsx" size="large" />
            <span>厂内排队（一次计量先后顺序）</span>
          </el-form-item>
          <el-form-item label="单价获取:">
            <el-radio-group v-model="formsales.djhq" class="ml-4">
              <el-radio label="1" size="small">入厂</el-radio>
              <el-radio label="2" size="small">一次计量</el-radio>
              <el-radio label="3" size="small">二次计量</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计量余额不足:">
            <el-radio-group v-model="formsales.jlyebz" class="ml-4">
              <el-radio label="1" size="small">禁止下磅</el-radio>
              <el-radio label="2" size="small">允许下磅禁止出厂</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-tabs v-model="DeliveryName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="发货" name="fh">
        <el-form :inline="true" :model="formsales" class="demo-form-inline">
          <div class="divContent">
            <span>发货确认:</span>
            <el-radio-group v-model="formsales.isfhqr" class="ml-4">
              <el-radio label="1" size="small">无确认</el-radio>
              <el-radio label="2" size="small">先登记再确认</el-radio>
              <el-radio label="3" size="small">确认</el-radio>
            </el-radio-group>
            <span>排除0种物料</span>
            <a
              href="#"
              style="color: blue; margin-left: 10px; width: 100px; height: 30px"
              >设置</a
            >
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-tabs v-model="carName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="计量" name="jl">
        <el-form :inline="true" :model="formsales" class="demo-form-inline">
          <div class="divContent">
            允许超载
            <el-input class="minInput" v-model="formsales.isyxcz" />
            吨,
            <span>排除0种物料</span>
            <a href="#" style="color: blue; margin-left: 10px">设置物料、</a>
            <span>排除0个供应商</span>
            <a href="#" style="color: blue; margin-left: 10px">设置客户、</a>
            <el-checkbox
              v-model="formsales.isczData"
              label="处理超载数据"
              size="large"
              disabled
            />
          </div>
          <div class="divContent">
            <span>皮重异常校验</span>
            <el-input class="minInput" v-model="formsales.isyfsh" />
            吨
            <span style="margin-left: 80px"> 历史皮重取最近</span>
            <el-input class="minInput" v-model="formsales.isLspz" />吨
            <span style="margin-left: 80px">空车出厂允差</span>
            <el-input class="minInput" v-model="formsales.isCcarOut" />吨
          </div>

          <div class="divContent">
            <el-checkbox
              v-model="formsales.isSkin"
              label="皮重异常区分散、袋装"
              size="large"
            />
          </div>
          <el-form-item>
            <el-input
              class="minInput"
              v-model="formsales.isRepetitionjl"
            />分钟内禁止重复计量
          </el-form-item>
          <el-form-item>
            两次计量时间间隔
            <el-input
              class="minInput"
              v-model="formsales.isTwicejl"
            />分钟发起审批
          </el-form-item>

          <el-form-item>
            过毛后
            <el-input class="minInput" v-model="formsales.isOverhairs" />
            分钟内未出厂预警
          </el-form-item>
          <el-form-item>
            车辆出厂
            <el-input class="minInput" v-model="formsales.carOutFactory" />
            分钟内不允许入厂
          </el-form-item>

          <el-form-item>
            <el-checkbox
              v-model="formsales.isSalesOverhairs"
              label="销售计量允许多次过毛"
              size="large"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="formsales.carGetout"
              label="销售计量多次过毛发起审批"
              size="large"
            />
          </el-form-item>
          <div class="divContent">
            低于车货总重范围
            <el-input class="minInput" v-model="formsales.isyxcz" />
            吨,
            <span>排除0种物料</span>
            <a href="#" style="color: blue; margin-left: 10px">设置物料、</a>
            <span>排除0个供应商</span>
            <a href="#" style="color: blue; margin-left: 10px">设置客户、</a>
          </div>
          <div class="divContent">
            <el-checkbox
              v-model="formsales.iscyshtp1"
              label="厂内车数容量限制VIP"
              size="large"
            /><el-checkbox
              v-model="formsales.iscyshtp2"
              label="允许超订单量计量"
              size="large"
            />
            /><el-checkbox
              v-model="formsales.iscyshtp3"
              label="销售计量支付"
              size="large"
            />
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="logName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="打印" name="dy">
        <el-form :inline="true" :model="formsales" class="demo-form-inline">
          <div class="divContent">
            <span>磅单打印</span>
            <el-input class="minInput" v-model="formsales.Poundbill" />份
            <span style="margin-left: 80px"> 打印超 </span>
            <el-input
              class="minInput"
              v-model="formsales.PrintingExceed"
            />次以上补打审批
            <span style="margin-left: 80px">打印方式:</span>
            <el-radio-group v-model="formsales.Printingmode" class="ml-4">
              <el-radio label="1" size="small">直接打印</el-radio>
              <el-radio label="2" size="small">预览打印</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>质检报告打印</span>
            <el-input class="minInput" v-model="formsales.CheckReport" />份
            <span style="margin-left: 80px"> 打印超 </span>
            <el-input
              class="minInput"
              v-model="formsales.PrintingExceed2"
            />次以上补打审批
            <span style="margin-left: 80px">打印方式:</span>
            <el-radio-group v-model="formsales.Printingmode2" class="ml-4">
              <el-radio label="1" size="small">直接打印</el-radio>
              <el-radio label="2" size="small">预览打印</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>合格证打印</span>
            <el-input class="minInput" v-model="formsales.Qualified" />份
            <span style="margin-left: 80px"> 打印超 </span>
            <el-input
              class="minInput"
              v-model="formsales.PrintingExceed3"
            />次以上补打审批
            <span style="margin-left: 80px">打印方式:</span>
            <el-radio-group v-model="formsales.Printingmode3" class="ml-4">
              <el-radio label="1" size="small">直接打印</el-radio>
              <el-radio label="2" size="small">预览打印</el-radio>
            </el-radio-group>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="imgName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="精度" name="jd">
        <el-form :inline="true" :model="formsales" class="demo-form-inline">
          <div class="divContent">
            <span>计量金额精度</span>
            <el-input class="minInput" v-model="formsales.isjlje" />位,
            <span style="margin-left: 80px">取值方式:</span>
            <el-radio-group v-model="formsales.isjljejd" class="ml-4">
              <el-radio label="1" size="small">四舍五入</el-radio>
              <el-radio label="2" size="small">去位</el-radio>
              <el-radio label="3" size="small">进位</el-radio>
              <el-radio label="4" size="small">四舍六入五成双</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>货款金额精度</span>
            <el-input class="minInput" v-model="formsales.isjlje2" />位,
            <span style="margin-left: 80px">取值方式:</span>
            <el-radio-group v-model="formsales.isjljejd2" class="ml-4">
              <el-radio label="1" size="small">四舍五入</el-radio>
              <el-radio label="2" size="small">去位</el-radio>
              <el-radio label="3" size="small">进位</el-radio>
              <el-radio label="4" size="small">四舍六入五成双</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>运费金额精度</span>
            <el-input class="minInput" v-model="formsales.isjlje3" />位,
            <span style="margin-left: 80px">取值方式:</span>
            <el-radio-group v-model="formsales.isjljejd3" class="ml-4">
              <el-radio label="1" size="small">四舍五入</el-radio>
              <el-radio label="2" size="small">去位</el-radio>
              <el-radio label="3" size="small">进位</el-radio>
              <el-radio label="4" size="small">四舍六入五成双</el-radio>
            </el-radio-group>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-tabs v-model="CementName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="水泥" name="sn">
        <el-form :inline="true" :model="formsales" class="demo-form-inline">
          <el-form-item>
            <span>补包数量取值方式:</span>
            <el-radio-group v-model="formsales.ispushData" class="ml-4">
              <el-radio label="1" size="small">去位</el-radio>
              <el-radio label="2" size="small">进位</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <span>回包数量取值方式:</span>
            <el-radio-group v-model="formsales.ispushData2" class="ml-4">
              <el-radio label="1" size="small">去位</el-radio>
              <el-radio label="2" size="small">进位</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="divContent">
            <p>
              <span>袋装补回包误差范围规则</span>
              <el-input
                class="minInput"
                v-model="formsales.isjlje3"
              />吨关闭派车单
              <span>＜净重＜</span>
              <el-input class="minInput" v-model="formsales.isjlje3" />吨，
              <span>误差下限</span>
              <el-input class="minInput" v-model="formsales.isjlje3" />%上限
              <el-input class="minInput" v-model="formsales.isjlje3" />%
            </p>
            <p style="position: relative; left: 143px">
              <el-input
                class="minInput"
                v-model="formsales.isjlje3"
              />吨关闭派车单
              <span>＜净重＜</span>
              <el-input class="minInput" v-model="formsales.isjlje3" />吨，
              <span>误差下限</span>
              <el-input class="minInput" v-model="formsales.isjlje3" />%上限
              <el-input class="minInput" v-model="formsales.isjlje3" />%
            </p>
            <p style="position: relative; left: 143px">
              <el-input
                class="minInput"
                v-model="formsales.isjlje3"
              />吨关闭派车单
              <span>＜净重＜</span>
              <el-input class="minInput" v-model="formsales.isjlje3" />吨，
              <span>误差下限</span>
              <el-input class="minInput" v-model="formsales.isjlje3" />%上限
              <el-input class="minInput" v-model="formsales.isjlje3" />%
            </p>
            <p style="position: relative; left: 143px">
              <el-input
                class="minInput"
                v-model="formsales.isjlje3"
              />吨关闭派车单
              <span>＜净重＜</span>
              <el-input class="minInput" v-model="formsales.isjlje3" />吨，
              <span>误差下限</span>
              <el-input class="minInput" v-model="formsales.isjlje3" />%上限
              <el-input class="minInput" v-model="formsales.isjlje3" />%
            </p>
            <p style="position: relative; left: 143px">
              <el-input
                class="minInput"
                v-model="formsales.isjlje3"
              />吨关闭派车单
              <span>＜净重＜</span>
              <el-input class="minInput" v-model="formsales.isjlje3" />吨，
              <span>误差下限</span>
              <el-input class="minInput" v-model="formsales.isjlje3" />%上限
              <el-input class="minInput" v-model="formsales.isjlje3" />%
            </p>
          </div>
          <div class="divContent">
            <span>袋装拼单:</span>
            <el-radio-group v-model="formsales.ispushData2" class="ml-4">
              <el-radio label="1" size="small">不允许拼单</el-radio>
              <el-radio label="2" size="small">任意客户任意物料</el-radio>
              <el-radio label="3" size="small">任意客户同物料</el-radio>
              <el-radio label="4" size="small">同客户同物料</el-radio>
              <el-radio label="5" size="small">同客户任意物料</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>散装拼单:</span>
            <el-radio-group v-model="formsales.ispushData2" class="ml-4">
              <el-radio label="1" size="small">不允许拼单</el-radio>
              <el-radio label="2" size="small">同客户同物料</el-radio>
              <el-radio label="3" size="small">任意客户同物料</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>袋装批号扣减:</span>
            <el-radio-group v-model="formsales.ispushData2" class="ml-4">
              <el-radio label="1" size="small">皮重计量</el-radio>
              <el-radio label="2" size="small">毛重计量</el-radio>
            </el-radio-group>
          </div>
          <div class="divContent">
            <span>批号扣减规则:</span>
             <el-checkbox
              v-model="formsales.iscyshtp1"
              label="物料"
              size="large"
            />
             <el-checkbox
              v-model="formsales.iscyshtp1"
              label="物料+客户"
              size="large"
            />
             <el-checkbox
              v-model="formsales.iscyshtp1"
              label="物料+筒仓"
              size="large"
            />
             <el-checkbox
              v-model="formsales.iscyshtp1"
              label="物料+客户+筒仓"
              size="large"
            />
          </div>
          <div class="Form-Button">
            <el-button type="primary" @click="globalSubmit">保存</el-button>
            <el-button type="primary" @click="sysList">还原默认认知</el-button>
          </div>
        </el-form>
      </el-tab-pane></el-tabs
    >
  </div>
</template>

<script setup>
import { SubmintSystemData, getSystemList } from "@/api/system/global";
const { proxy } = getCurrentInstance();
const route = useRoute();
const pcName = ref("order");
const DateName = ref("pc");
const SlName = ref("pd");
const DeliveryName = ref("fh");
const carName = ref("jl");
const logName = ref("dy");
const imgName = ref("jd");
const zzjName = ref("zzj");
const CementName = ref("sn");
const formsales = ref({
  //密码
  isxsddkz: false,
  istjbc: false,
  PcdTime: "",
  isxspcl: "",
  isglsh: false,
  ispcdbc: false,
  isclyx: false,
  issjyx: false,
  xsxhpcdd: "",
  isxspctp: "",
  isxspctpzs: "",
  ispz: false,
  isxc: false,
  isxxddlj: false,
  isxxclks: false,
  isxsddljje: false,
  cwpd: "1",
  cnpdsx: false,
  djhq: "1",
  jlyebz: "1",
  isfhqr: "1",
  isyxcz: "",
  isczData: false,
  isyfsh: "",
  isLspz: "",
  isCcarOut: "",
  isSkin: false,
  isRepetitionjl: "",
  isTwicejl: "",
  isOverhairs: "",
  carOutFactory: "",
  isSalesOverhairs: false,
  carGetout: false,
  iscyshtp1: false,
  iscyshtp2: false,
  iscyshtp3: false,
  Poundbill: "",
  PrintingExceed: "",
  Printingmode: "1",
  CheckReport: "",
  PrintingExceed2: "",
  Printingmode2: "1",
  Qualified: "",
  PrintingExceed3: "",
  Printingmode3: "1",
  isjlje: "",
  isjljejd: "1",
  isjlje2: "",
  isjljejd2: "1",
  isjlje3: "",
  isjljejd3: "2",
  ispushData: "1",
  ispushData2: "1",
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
        ...formsales.value,
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
    formsales.value = res;
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
    font-size: 13px;
  }
  .divContent {
    margin: 5px;
    margin-left: 0px;
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
    // span {
    //   margin-right: 30px;
    //   position: relative;
    //   top: -2px;
    // }
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
