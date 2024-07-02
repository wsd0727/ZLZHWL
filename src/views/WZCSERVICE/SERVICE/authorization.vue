<template>
  <teleport to="#custemPageBtn" :disabled="!(active > 0)">
    <el-button v-if="active > 0" @click="Prev" size="default">上一步</el-button>
  </teleport>
  <teleport to="#custemPageBtn" :disabled="!(active == 0 || pageList.length - 1 > active)">
    <el-button v-if="active == 0 || pageList.length - 1 > active" @click="Next" :disabled="active == '0'?form.VALIDATED != '1':false" type="primary" size="default">下一步</el-button>
  </teleport>
  <teleport to="#custemPageBtn" :disabled="!(pageList.length > 0 && active == pageList.length - 1)">
    <el-button v-if="pageList.length > 0 && active == pageList.length - 1" @click="Submit" type="primary" size="default">完成</el-button>
  </teleport>
  <div class="author">
    <el-steps class="author" :space="200" :active="active" align-center finish-status="success">
      <el-step title="检查功能和依赖" />
      <el-step title="生成AppID" />
      <el-step title="完成授权" />
    </el-steps>
    <template v-if="active == 0">
      <el-result :icon="active1Icon" :title="active1Title" :sub-title="active1Desc" />
    </template>
    <template v-else-if="active == 1">
      <div class="authinfo">
        <p>已为 <b>{{form.CUSTOMERNAME}}</b> 生成的 <b>AppID</b> 和 <b>AppSecre</b></p>
        <p><b>AppID</b>：<b>{{form.CLIENTID}}</b></p>
        <p><b>AppSecret</b>：<b>{{form.APPSECRET}}</b></p>
      </div>
    </template>
    <template v-else-if="active == 2">
      <el-result icon="success" title="完成授权" />
    </template>
  </div>
</template>

<script setup>
import request from "@/utils/request";
const props = defineProps({
  currentData: Object,
})
const emit = defineEmits(["close"])

const BILLNO = computed(() => props.currentData[0].BILLNO || "");

const active = ref(0)
const pageList = reactive([1, 2, 3])
const Prev = () => {
  active.value--
}
const Next = () => {
  active.value++
  if (active.value == 1 && form.value.AUTHORIZATIONSTATUS != '1') getAutherInfo()
}

// active1
const form = ref()
const active1Icon = ref("success")
const active1Title = ref("通过")
const active1Desc = ref("未检测出需要购买的强依赖功能")
const getMenuModules = () => {
  request({
    url: "/implementManage/checkFeaturesAndDependencies",
    method: "post",
    data: {
      BILLNO: BILLNO.value,
      MODULEID: "MU230824650075",
      PAGEID: "PG240312875223",
    }
  }).then(res => {
    form.value = res.RESULT
    active1Icon.value = form.value.VALIDATED == '1' ? 'success' : 'error'
    active1Title.value = form.value.VALIDATED == '1' ? "通过" : "未通过"
    active1Desc.value = form.value.VALIDATED == '1' ? "未检测出需要购买的强依赖功能" : form.value.CHECKALERT
  })
}

// active2
const authInfo = ref({})
const getAutherInfo = () => {
  request({
    url: "/implementManage/generateAuthorizationCode",
    method: "post",
    data: {
      BILLNO: BILLNO.value,
      MODULEID: "MU230824650075",
      PAGEID: "PG240312875223",
    }
  }).then(res => {
    authInfo.value = res.RESULT
  })
}

const Submit = () => {
  active.value = 0
  emit("close")
}


getMenuModules()
</script>
<style lang="scss" scoped>
.author {
  width: 100%;
}
.authinfo {
  padding-left: 20px;
}
</style>