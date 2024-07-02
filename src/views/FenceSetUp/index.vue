<template>
  <div class="fence">
    <el-scrollbar class="form" :height="mapheight">
      <el-form ref="formRef" label-width="80px" :rules="rules" :model="form" size="default" :validate-on-rule-change="false">
        <div class="group-title">绘制工具</div>
        <el-form-item label="围栏">
          <el-radio-group v-model="mapData.type">
            <el-radio-button label="circle">圆形</el-radio-button>
            <el-radio-button label="polygon">多边形</el-radio-button>
            <el-radio-button label="region">行政区</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="半径(米)" v-if="mapData.type=='circle'">
          <el-input v-model="mapData.radius" disabled type="number" />
        </el-form-item>
        <el-form-item label="省市区" v-if="mapData.type=='region'" prop="COUNTRYCODE">
          <el-cascader v-model="mapData.adcodeArr" clearable :options="optionsRegion" style="width: 100%" />
        </el-form-item>
        <div class="group-title">围栏信息</div>
        <el-form-item label="名称" prop="VNAME">
          <el-input v-model="form.VNAME" maxlength="200" />
        </el-form-item>
        <el-form-item label="公司" prop="PK_CUSTOMER">
          <el-select v-model="form.PK_CUSTOMER" style="width:100%" placeholder="" filterable remote :remote-method="searchKS" @change="setKS" clearable @clear="setKS">
            <el-option v-for="item in KSList" :key="item.VALUE" :label="item.LABEL" :value="item.VALUE" style="width:300px"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="VTYPE">
          <el-radio-group v-model="form.VTYPE" class="ml-4">
            <el-radio v-for="item in options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
          <!-- <el-select v-model="form.VTYPE" style="width:100%;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select> -->
        </el-form-item>
        <el-form-item label="中转站" prop="TRANSITFLAG">
          <el-radio-group v-model="form.TRANSITFLAG" class="ml-4">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人" prop="CONTACTS">
          <el-input v-model="form.CONTACTS" maxlength="10" />
        </el-form-item>
        <el-form-item label="电话" prop="CONTACTTEL">
          <el-input v-model="form.CONTACTTEL" maxlength="11" />
        </el-form-item>
        <el-form-item label="详细地址" prop="ADDRESS">
          <el-input v-model="form.ADDRESS" disabled :rows="3" type="textarea" />
        </el-form-item>
        <!-- <el-form-item label="专属围栏">
          <el-switch v-model="form.VDEF2" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitWLdata(formRef)">保存围栏</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="mapcontent">
      <mapComponent ref="mapRef" search searchBeforeEditInit edit :height="formHeight" :zoom="9" v-model:type="mapData.type" v-model:adcode="mapData.adcodeArr" v-model:center="mapData.center" v-model:path="mapData.path" v-model:radius="mapData.radius" @change="mapChange" />
    </div>
  </div>
</template>

<script setup>
import mapComponent from "@/components/Map";
import { WLsubmit, WLdetail } from "#/system/fence";
import { nextTick, onMounted } from "vue";
const { proxy } = getCurrentInstance();

const router = useRouter();
const MENUID = router.currentRoute.value.meta.BILLNO;
const routerParams = router.currentRoute.value.meta;
const EditBillNo = computed(() => router.currentRoute.value.query.billno);

const formHeight = window.innerHeight - 120 + "px";
const mapRef = ref(null);
const formRef = ref(null);

const optionsRegion = ref([]);
const getAreaData = import("/public/areadata.js").then((res) => {
  optionsRegion.value = res.default;
});

const rules = reactive({
  VNAME: [{ required: true, message: "请输入", trigger: "blur" }],
  PK_CUSTOMER: [{ required: true, message: "请选择", trigger: "change" }],
  CONTACTS: [
    { required: true, message: "请输入联系人", trigger: "blur" },
    // {
    //   pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
    //   message: "联系人格式不正确",
    //   trigger: "blur",
    // },
  ],
  CONTACTTEL: [
    {
      pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      message: "电话格式不正确",
      trigger: "blur",
    },
    { required: true, message: "请输入电话", trigger: "blur" },
  ],
  // COUNTRYCODE: [{ required: true, message: "请选择行政区", trigger: "change" }],
  // adcodeArr : [{ required: true, message: "请选择行政区", trigger: "change" }],
});
const form = ref({});
const mapData = ref({});
const initForm = (data = null) => {
  form.value = data
    ? data
    : {
        VNAME: "",
        PK_CUSTOMER: "",
        CUSTOMERNAME: "",
        VTYPE: "1",
        ADDRESS: "",
        FENCETYPE: "circle",
        LONANDLAT: "",
        RADIUS: "",
        COUNTRYCODE: "",
        AREACODENAME: "",
        CONTACTS: "",
        CONTACTTEL: "",
        AdministrativeRegion: "",
        TRANSITFLAG: "0",
      };
  let obj = {
    type: form.value.FENCETYPE,
    path: form.value.LONANDLAT
      ? JSON.parse(
          form.value.LONANDLAT.includes("[")
            ? form.value.LONANDLAT
            : `[${form.value.LONANDLAT}]`
        )
      : [],
    center: [],
    radius: form.value.RADIUS || 1000,
    adcode: form.value.COUNTRYCODE || [],
    adcodeArr: form.value.COUNTRYCODE? form.value.SHOWFENCEINFO.split(",") : [],
  };
  mapData.value = obj;
};
watch(
  mapData,
  (val) => {
    form.value.FENCETYPE = val.type;
    form.value.LONANDLAT = val.path;
    form.value.RADIUS = val.radius;
    // form.value.COUNTRYCODE = Array.isArray(val.adcode)
    //   ? val.adcode[val.adcode.length - 1]
    //   : val.adcode.split(",").slice(-1).join("");
    form.value.COUNTRYCODE = val.adcode;

    if (form.value.FENCETYPE != "region") {
      form.value.ADDRESS = val.address;
      form.value.AREACODENAME = val.adcodeAddress;
    }
    console.log(val, form.value);
  },
  {
    deep: true,
  }
);
const mapChange = (res) => {
  mapData.value = res.data;
  // mapData.value.adcodeArr = Array.isArray(res.data.adcode) ? res.data.adcode : res.data.adcode.split(",")
};

const options = [
  { value: "1", label: "签到围栏" },
  { value: "2", label: "签收围栏" },
];

const KSList = ref([]);
const searchKS = (keyword) => {
  proxy
    .request({
      url: "/sys/component/getSelectTypeList",
      method: "post",
      data: {
        KEYWORD: keyword,
        TYPE: "201",
      },
      headers: {
        repeatSubmit: false,
      },
    })
    .then(({ RESULT }) => {
      KSList.value = RESULT;
    })
    .catch(() => {
      KSList.value = [];
    });
};
const setKS = (val) => {
  if (!val) {
    form.value.CUSTOMERNAME = "";
  } else {
    let data = KSList.value.find((el) => el.VALUE == val);
    form.value.CUSTOMERNAME = data.LABEL;
  }
};

const getDetail = () => {
  WLdetail({
    BILLNO: EditBillNo.value,
  }).then((res) => {
    nextTick(() => {
      searchKS(res.RESULT.CUSTOMERNAME);
    });
    initForm(res.RESULT);
  });
};

function submitWLdata(formEl) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      let data = {
        DR: "0",
        SORTNAME: "",
        ...form.value,
        BILLNO: EditBillNo.value,
        REVERSE: "",
        MODULEID: routerParams.BILLNO,
        AdministrativeRegion: mapData.value.adcodeArr.join(","),
      };
      WLsubmit(data).then((res) => {
        proxy.$modal.msgSuccess("保存成功");
        EditBillNo.value = "";
        initForm();
        setTimeout(() => {
          router.push({ path: "/da/logistics/wlgl" });
        }, 100);
      });
    }
  });
}
initForm();

watch(
  EditBillNo,
  (val) => {
    if (val) {
      mapRef.value && mapRef.value.cleatAllMarker();
      getDetail();
    }
  },
  {
    immediate: true,
  }
);

onMounted(()=>{
  searchKS('')
})

// watchEffect(() => {
//   if (EditBillNo.value) {
//     mapRef.value && mapRef.value.cleatAllMarker()
//     getDetail()
//   } else {
//     initForm()
//   }
// });
</script>
<style lang="scss" scoped>
.fence {
  width: 100%;
  height: v-bind(formHeight);
  display: flex;
  background: #fff;
  .form {
    width: 25%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .mapcontent {
    width: 75%;
    height: 100%;
  }
  .group-title {
    padding: 10px;
    border-bottom: 1px solid var(--el-border-color-light);
    margin-bottom: 10px;
  }
}
</style>