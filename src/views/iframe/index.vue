<template>
  <div>
    <i-frame v-model:src="iframeUrl"></i-frame>
  </div>
</template>
<script setup>
import iFrame from '@/components/iFrame'
import { getToken } from "@/utils/auth";
const router = useRouter();
const routerParams = router.currentRoute.value.meta;
const route = useRoute();
let MYBILLNO = route.query.billno;
// "https://www.baidu.com/"  //  ref(import.meta.env.VITE_APP_BASE_API + '/druid/login.html');
const iframeUrl = ref('')
function getTokenSplie() {
  let url = routerParams.VURL;
  if (url.includes("${token}")) { 
    url = url.replace("${token}", getToken());
    if (MYBILLNO) {
      iframeUrl.value = url+'&'+'billNo'+'='+MYBILLNO +'&modelId='+MYBILLNO;
    } else {
      iframeUrl.value = url;

    }
  } else {
    iframeUrl.value = url +'?modelId=' + MYBILLNO
  }
}
getTokenSplie();
</script>
