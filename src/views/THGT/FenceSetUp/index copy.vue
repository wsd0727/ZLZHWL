<template>
  <keep-alive>
    <div class="fence-app">
      <el-scrollbar :height="mapheight" class="leftContent">
        <el-form ref="formRef" label-width="100px" :rules="SSrules" :model="fromWlData" size="default" :validate-on-rule-change="false">
          <div class="group-title">
            <span style="padding-left: 20px">绘制工具</span>
            <el-divider border-style="dashed" />
          </div>
          <el-form-item label="围栏">
            <el-radio-group v-model="mapData.type" @change="onChange">
              <el-radio-button label="circle">圆形</el-radio-button>
              <el-radio-button label="polygon">多边形</el-radio-button>
              <el-radio-button label="region">行政区</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="省市区" v-if="statusMl=='2'" prop="AdministrativeRegion">
            <el-cascader v-model="fromWlData.AdministrativeRegion" clearable :options="optionsRegion" style="width: 100%" @change="(val) => SelectChange(val)" @clear="SelectChange(Ci, null)" @keydown.enter="enterNextEl" />
          </el-form-item>
          <el-form-item label="半径(米)" v-if="mapData.type=='circle'">
            <el-input v-model="mapData.radius" disabled type="number" />
          </el-form-item>
          <el-form-item>
            <el-button type="warning" @click="clearClick">清空图形</el-button>
          </el-form-item>
          <div class="group-title">
            <span style="padding-left: 20px">围栏信息</span>
            <el-divider border-style="dashed" />
          </div>
          <el-form-item label="围栏名称" prop="VNAME">
            <el-input v-model="fromWlData.VNAME" maxlength="200" />
          </el-form-item>
          <el-form-item label="公司" prop="PK_CUSTOMER">
            <el-select v-model="fromWlData.PK_CUSTOMER" style="width:100%" placeholder=" " filterable remote :remote-method="searchKS" @change="setKS" clearable @clear="setKS">
              <el-option v-for="item in KSList" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" style="width:300px"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="VTYPE">
            <el-radio-group v-model="fromWlData.VTYPE" class="ml-4">
              <el-radio v-for="item in options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
            <!-- <el-select v-model="fromWlData.VTYPE" style="width:100%;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
          </el-form-item>
          <el-form-item label="中转站" prop="TRANSITFLAG">
            <el-radio-group v-model="fromWlData.TRANSITFLAG" class="ml-4">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联系人" prop="CONTACTS">
            <el-input v-model="fromWlData.CONTACTS" maxlength="10" />
          </el-form-item>
          <el-form-item label="电话" prop="CONTACTTEL">
            <el-input v-model="fromWlData.CONTACTTEL" maxlength="11" />
          </el-form-item>
          <el-form-item label="详细地址" prop="ADDRESS">
            <el-input v-model="fromWlData.ADDRESS" disabled :rows="3" type="textarea" />
          </el-form-item>
          <!-- <el-form-item label="专属围栏">
          <el-switch v-model="fromWlData.VDEF2" />
        </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="submitWLdata(formRef)">保存围栏</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="mapContent">
        <mapComponent searchBeforeEditInit :detail="detail" :search="mapKeyWord" :height="mapheight" v-model:type="mapData.type" v-model:adcode="mapData.adcode" v-model:center="mapData.center" v-model:path="mapData.path" v-model:radius="mapData.radius" @change="mapChange" />
      </div>
    </div>
  </keep-alive>
</template>

<script setup>
const mapheight = window.innerHeight - 120 + 'px';
import mapComponent from "@/components/Map";
import { WLsubmit, WLdetail } from "#/system/fence";
const { proxy } = getCurrentInstance();
const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;
const routerParams = router.currentRoute.value.meta;
// 地图数据
const EditBillNo = ref(router.currentRoute.value.query.billno);
const mapRef = ref(null);

const formRef = ref()
const SSrules = reactive({
  VNAME: [
    { required: true, message: '请输入围栏名称', trigger: 'blur' }
  ],
  PK_CUSTOMER: [
    { required: true, message: '请选择客商', trigger: 'change' }
  ],
  VTYPE: [
    { required: true, message: '请选择围栏类型', trigger: 'change' }
  ],
  CONTACTS: [
    { pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/, message: '联系人格式不正确', trigger: 'blur' },
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  CONTACTTEL: [
    { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: '电话格式不正确', trigger: 'blur' },
    { required: true, message: '请输入电话', trigger: 'blur' }
  ],
  AdministrativeRegion: [
    { required: true, message: '请选择行政区', trigger: 'change' }
  ],
})
const mapData = ref({
  type: "circle",
  path: [],
  center: [],
  radius: '',
  adcode: [],
});
const statusMl = ref('1')

const fromWlData = ref({
  VNAME: '',
  PK_CUSTOMER: "",
  CUSTOMERNAME: "",
  VTYPE: '1',
  ADDRESS: '',
  FENCETYPE: 'circle',
  LONANDLAT: '',
  RADIUS: '',
  COUNTRYCODE: '',
  AREACODENAME: '',
  CONTACTS: "",
  CONTACTTEL: "",
  AdministrativeRegion: null,
  TRANSITFLAG: "0"
})
const options = [
  { value: '1', label: '签到围栏', },
  { value: '2', label: '签收围栏', }
]

const KSList = ref([])
const searchKS = keyword => {
  proxy.request({
    url: "/sys/component/getSelectTypeList",
    method: "post",
    data: {
      KEYWORD: keyword,
      TYPE: "201"
    },
    headers: {
      repeatSubmit: false,
    },
  }).then(({ RESULT }) => {
    KSList.value = RESULT;
  }).catch(() => {
    KSList.value = []
  });
}
const setKS = val => {
  if (!val) {
    fromWlData.value.CUSTOMERNAME = ""
  } else {
    let data = KSList.value.find(el => el.VALUE == val)
    fromWlData.value.CUSTOMERNAME = data.LABEL
  }
}

function clearClick() {
  mapData.value = {
    type: "circle",
    path: [],
    center: [],
    radius: '',
    adcode: [],
  };
  fromWlData.value = {
    VNAME: '',
    PK_CUSTOMER: "",
    CUSTOMERNAME: "",
    VTYPE: '1',
    ADDRESS: '',
    FENCETYPE: 'circle',
    LONANDLAT: '',
    RADIUS: '',
    COUNTRYCODE: '',
    AREACODENAME: '',
    CONTACTS: "",
    CONTACTTEL: "",
    AdministrativeRegion: null,
    TRANSITFLAG: "0"
  };
}
function onChange(e) {
  if (e == 'circle') {
    statusMl.value = '1'
  } else if (e == 'polygon') {
    statusMl.value = '1'
  } else {
    statusMl.value = '2'
  }
  fromWlData.value.FENCETYPE = e;
}
function handDetailData() {
  let data = {
    BILLNO: EditBillNo.value,
  };
  // searchKS('')
  WLdetail(data).then((res) => {
    mapData.value.type = res.RESULT.FENCETYPE;
    // map
    if (mapData.value.type == 'region') {
      statusMl.value = '2'
      mapData.value.adcode = res.RESULT.COUNTRYCODE;
      mapData.value.path = []
      mapData.value.center = []
      mapData.value.radius = 0
    } else {
      statusMl.value = '1'
      mapData.value.adcode = ""
      mapData.value.path = JSON.parse(res.RESULT.SHOWFENCEINFO);
      // mapData.value.center = JSON.parse(res.RESULT.SHOWFENCEINFO);
      mapData.value.radius = res.RESULT.RADIUS;
    }
    fromWlData.value.LONANDLAT = res.RESULT.SHOWFENCEINFO;
    fromWlData.value.AREACODENAME = res.RESULT.AREACODENAME;
    fromWlData.value.VNAME = res.RESULT.VNAME;
    fromWlData.value.VTYPE = res.RESULT.VTYPE;
    fromWlData.value.TRANSITFLAG = res.RESULT.TRANSITFLAG
    fromWlData.value.CONTACTS = res.RESULT.CONTACTS;
    fromWlData.value.CONTACTTEL = res.RESULT.CONTACTTEL;
    fromWlData.value.ADDRESS = res.RESULT.ADDRESS;
    fromWlData.value.CUSTOMERNAME = res.RESULT.CUSTOMERNAME
    // fromWlData.value.VDEF2 = res.RESULT.VDEF2 == '0' ? false : true;
    fromWlData.value.FENCETYPE = res.RESULT.FENCETYPE;
    fromWlData.value.RADIUS = res.RESULT.RADIUS;
    fromWlData.value.PK_CUSTOMER = res.RESULT.PK_CUSTOMER;
    if (res.RESULT.COUNTRYCODE != '') {
      fromWlData.value.COUNTRYCODE = res.RESULT.COUNTRYCODE;
      fromWlData.value.AREACODENAME = res.RESULT.AREACODENAME;
      fromWlData.value.AdministrativeRegion = res.RESULT.SHOWFENCEINFO.split(",");
    }
    searchKS(fromWlData.value.CUSTOMERNAME)
  });
}
function SelectChange(val) {
  let data = Array.isArray(val) ? [] : null;
  let [province, city, county] = val;
  let areaData = {
    data: val.join(","),
    province,
    provinceName: treeFind(optionsRegion.value, (al) => al.value == province).label,
    city,
    cityName: treeFind(optionsRegion.value, (al) => al.value == city).label,
    county,
    countyName: county != undefined ? treeFind(optionsRegion.value, (al) => al.value == county).label : undefined,
  };
  areaData.dataName = ([areaData.provinceName, areaData.cityName, areaData.countyName]).join(",")
  mapData.value.adcode = areaData.data;
  fromWlData.value.COUNTRYCODE = areaData.data;
  fromWlData.value.AREACODENAME = ([areaData.provinceName, areaData.cityName, areaData.countyName]).join(",")
  fromWlData.value.ADDRESS = ([areaData.provinceName, areaData.cityName, areaData.countyName]).join("")
}
// 查找树结构中的数据
function treeFind(tree, func) {
  for (const data of tree) {
    if (func(data)) return data;
    if (data.CHILDREN) {
      const res = treeFind(data.CHILDREN, func);
      if (res) return res;
    } else if (data.children) {
      const res = treeFind(data.children, func);
      if (res) return res;
    }
  }
  return null;
}
function submitWLdata(formEl) {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // fromWlData.value.VDEF2 = fromWlData.value.VDEF2 == false ? "0" : '1'
      let data = {
        DR: "0",
        SORTNAME: "",
        ...fromWlData.value,
        BILLNO: EditBillNo.value,
        REVERSE: "",
        MODULEID: routerParams.BILLNO,
      };
      WLsubmit(data).then((res) => {
        proxy.$modal.msgSuccess("保存成功");
        EditBillNo.value = ""
        mapData.value = {
          type: "circle",
          path: [],
          center: [],
          radius: 1000,
          adcode: [],
        }
        fromWlData.value = {
          VNAME: '',
          VTYPE: '1',
          ADDRESS: '',
          FENCETYPE: 'circle',
          LONANDLAT: '',
          RADIUS: '',
          COUNTRYCODE: '',
          AREACODENAME: '',
          AdministrativeRegion: null,
          TRANSITFLAG: "0"
        }
        setTimeout(() => {
          router.push({ path: '/da/logistics/wlgl', });
        }, 100);
      }).catch(() => {
      });
    }
  })
}
const optionsRegion = ref([]);
const getAreaData = import("/public/areadata.js").then(res => {
  optionsRegion.value = res.default;
});

const mapChange = (res) => {
  fromWlData.value.FENCETYPE = res.data.type;
  fromWlData.value.LONANDLAT = res.data.path;
  fromWlData.value.RADIUS = res.data.radius;
  fromWlData.value.ADCODE = Array.isArray(res.data.adcode) ? res.data.adcode[res.data.adcode.length - 1] : res.data.adcode.split(",").slice(-1).join("")
  if (fromWlData.value.FENCETYPE != 'region') {
    fromWlData.value.ADDRESS = res.data.address;
    fromWlData.value.AREACODENAME = res.data.adcodeAddress
  }
  mapData.value.radius = res.data.radius
  nextTick(() => {
    mapData.value
  })
};

searchKS()
// watchEffect(() => {
//   console.log(111, EditBillNo.value);
//   if (EditBillNo.value) {
//     if (mapRef.value) mapRef.value.cleatAllMarker()
//     handDetailData()
//   } else {
//     console.log(222, fromWlData.value);
//   }
// });
onActivated(() => {
  console.log(111111111111111);
})
onDeactivated(() => {
  console.log(1231231092309908);
})
onBeforeUnmount(() => {
  console.log('ssssssssssss');
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  color: #666 !important;
}
.fence-app {
  width: 100%;
  height: v-bind(mapheight);
  margin: 0;
  padding: 0;
  display: flex;
  align-items: stretch;
  .leftContent {
    height: 100%;
    padding: 10px;
    min-width: 400px;
    background: #fff;
    flex: 0.3;
  }
  .mapContent {
    flex: 0.7;
    height: 100%;
  }
}
</style>